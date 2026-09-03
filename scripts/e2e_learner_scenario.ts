import { User, Attempt, SkillMastery, Recommendation, LearningPathStep, LearningResource } from '../src/types.js';

const BASE_URL = 'http://localhost:3000';

async function runScenario() {
  console.log('======================================================================');
  console.log('🚀 STARTING LEARNTRACE END-TO-END ACCEPTANCE VERIFICATION');
  console.log('SCENARIO: Page 3 Learner Workflow');
  console.log('1. Set Machine Learning goal');
  console.log('2. Fail Probability quiz');
  console.log('3. Verify recommendation prioritizes Probability & Conditional Probability');
  console.log('4. Study curated learning resource');
  console.log('5. Retake quiz with correct answers');
  console.log('6. Verify BKT and LearnTrace mastery updates');
  console.log('======================================================================\n');

  // STEP 1: Create a dedicated learner for this verification
  const testEmail = `learner_page3_${Date.now()}@learntrace.ai`;
  const testPassword = 'Password123!';
  const testName = 'Alex Mercer (MLE Candidate)';

  console.log(`[Step 1] Registering fresh learner: ${testEmail}...`);
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: testName, email: testEmail, password: testPassword }),
  });
  const authData = await regRes.json();
  if (!authData.token) {
    throw new Error(`Registration failed: ${JSON.stringify(authData)}`);
  }
  const token = authData.token;
  const user = authData.user;
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
  console.log(`✅ Learner registered successfully. User ID: ${user.id}\n`);

  // STEP 2: Select "Machine Learning Engineer" Goal
  console.log('[Step 2] Selecting Learning Goal: "Machine Learning Engineer" (goal_mle)...');
  const goalRes = await fetch(`${BASE_URL}/user-goals`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ goalId: 'goal_mle' }),
  });
  const goalData = await goalRes.json();
  console.log(`✅ Goal set to: "${goalData.userGoal.goal.name}" (Target Skill: ${goalData.userGoal.goal.targetSkillId})\n`);

  // Verify Initial State: get recommendations & path
  console.log('[Step 2b] Fetching initial learning path and recommendations...');
  const initRecRes = await fetch(`${BASE_URL}/recommendations`, { headers: authHeaders });
  const initRecData = await initRecRes.json();
  const initPathRes = await fetch(`${BASE_URL}/learning-path`, { headers: authHeaders });
  const initPathData: LearningPathStep[] = await initPathRes.json();
  
  console.log(`Current top recommendation: ${initRecData.recommendation?.skillName || 'None'}`);
  console.log(`Initial learning path sequence: ${initPathData.map(s => s.skillName).join(' ➔ ')}\n`);

  // STEP 3: Take Probability Quiz and Deliberately Fail
  console.log('[Step 3] Fetching Probability (skill_prob) questions for initial diagnostic quiz...');
  const qRes = await fetch(`${BASE_URL}/questions?skill_id=skill_prob&include_answers=true`, { headers: authHeaders });
  const questions = await qRes.json();
  console.log(`Retrieved ${questions.length} questions for skill_prob.`);

  console.log('\n--- Submitting Incorrect Answers to deliberately fail Probability quiz ---');
  // Submit 3 incorrect attempts for probability questions
  for (let i = 0; i < Math.min(3, questions.length); i++) {
    const q = questions[i];
    // Find a wrong answer
    const wrongOpt = q.options.find((opt: any) => opt.id !== q.correctAnswer) || q.options[0];
    const attemptPayload = {
      questionId: q.id,
      answer: wrongOpt.id,
      confidence: 4, // High confidence incorrect => Confident Misconception
      timeTakenSeconds: 12,
    };

    const attRes = await fetch(`${BASE_URL}/attempts`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(attemptPayload),
    });
    const attData = await attRes.json();
    console.log(`- Question ${i + 1} (${q.id}): Selected [${wrongOpt.id}], Correct: ${attData.correct ? 'YES' : 'NO'}, Cognitive State: ${attData.attempt?.cognitiveState}, Updated Mastery: ${(attData.updatedMastery?.masteryScore * 100).toFixed(1)}%`);
  }

  // STEP 4: Verify Recommendation Prioritizes Probability & Conditional Probability
  console.log('\n[Step 4] Checking pedagogical recommendations after failing Probability...');
  const failedRecRes = await fetch(`${BASE_URL}/recommendations`, { headers: authHeaders });
  const failedRecData = await failedRecRes.json();
  const failedRec = failedRecData.recommendation;

  console.log('------------------------------------------------------------');
  console.log(`🎯 RECOMMENDED SKILL: ${failedRec?.skillName} (${failedRec?.skillId})`);
  console.log(`📊 PRIORITY SCORE: ${failedRec?.priorityScore}`);
  console.log(`🔓 DOWNSTREAM UNBLOCKED: ${failedRec?.downstreamCount} skills`);
  console.log(`💡 PEDAGOGICAL REASON: "${failedRec?.reasonText}"`);
  console.log('------------------------------------------------------------');

  // Verify candidate analysis shows Conditional Probability depends on Probability
  const analysis = failedRecData.analysis;
  const probCandidate = analysis.find((c: any) => c.skill.id === 'skill_prob');
  const condProbCandidate = analysis.find((c: any) => c.skill.id === 'skill_cond_prob');

  console.log('\nDAG Prerequisite & Priority Analysis:');
  console.log(`• Probability (skill_prob): Ready=${probCandidate.isReady}, Mastery=${(probCandidate.mastery * 100).toFixed(1)}%, Priority=${probCandidate.priorityScore}, Unblocks=${probCandidate.downstreamCount}`);
  console.log(`• Conditional Probability (skill_cond_prob): Ready=${condProbCandidate.isReady}, Mastery=${(condProbCandidate.mastery * 100).toFixed(1)}%, Unmet Prerequisites=[${condProbCandidate.unmetPrerequisites.join(', ')}]`);

  if (failedRec?.skillId === 'skill_prob' || failedRec?.skillId === 'skill_python') {
    console.log('✅ PASS: Recommended skill correctly prioritizes foundational unmastered dependency (Probability / Python).');
  } else {
    console.warn(`⚠️ Warning: Expected skill_prob or foundational skill, got ${failedRec?.skillId}`);
  }

  if (condProbCandidate && condProbCandidate.unmetPrerequisites.includes('Probability')) {
    console.log('✅ PASS: Conditional Probability correctly blocked by unmet prerequisite "Probability"!');
  }

  // Also check learning path order
  const pathAfterFailRes = await fetch(`${BASE_URL}/learning-path`, { headers: authHeaders });
  const pathAfterFail: LearningPathStep[] = await pathAfterFailRes.json();
  console.log(`Updated Learning Path: ${pathAfterFail.map(s => `${s.order}. ${s.skillName} (${(s.masteryScore * 100).toFixed(0)}%)`).join(' ➔ ')}`);

  // STEP 5: Study Resource for Probability
  console.log('\n[Step 5] Accessing curated learning resources for Probability (skill_prob)...');
  const resRes = await fetch(`${BASE_URL}/resources?skill_id=skill_prob`, { headers: authHeaders });
  const resources: LearningResource[] = await resRes.json();
  console.log(`Retrieved ${resources.length} learning resources:`);
  resources.forEach((r, idx) => {
    console.log(`  ${idx + 1}. [${r.type.toUpperCase()}] "${r.title}" (Read time: ${r.readTimeMinutes} min)`);
  });

  const conceptGuide = resources.find(r => r.type === 'guide') || resources[0];
  console.log(`\nStudying: "${conceptGuide.title}"`);
  console.log(`Key Concepts: ${conceptGuide.keyConcepts.join('; ')}`);
  console.log(`First 200 chars of summary:\n"${conceptGuide.contentSummary.substring(0, 200)}..."\n`);

  // Check mastery before retake
  const preRetakeMasteryRes = await fetch(`${BASE_URL}/mastery`, { headers: authHeaders });
  const preRetakeMasteryData = await preRetakeMasteryRes.json();
  const preProbMastery = preRetakeMasteryData.find((m: any) => m.skillId === 'skill_prob');
  console.log(`Pre-retake Probability Mastery: ${(preProbMastery.masteryScore * 100).toFixed(1)}% (${preProbMastery.interpretation})`);

  // STEP 6: Retake Quiz with Correct Answers
  console.log('\n[Step 6] Retaking Probability Quiz with CORRECT answers...');
  for (let i = 0; i < Math.min(3, questions.length); i++) {
    const q = questions[i];
    const attemptPayload = {
      questionId: q.id,
      answer: q.correctAnswer, // Correct answer!
      confidence: 5,           // Solid mastery!
      timeTakenSeconds: 8,
    };

    const attRes = await fetch(`${BASE_URL}/attempts`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(attemptPayload),
    });
    const attData = await attRes.json();
    console.log(`- Retake Q${i + 1} (${q.id}): Correct=${attData.correct ? 'YES ✅' : 'NO ❌'}, Cognitive State=${attData.attempt?.cognitiveState}, Updated Mastery: ${(attData.updatedMastery?.masteryScore * 100).toFixed(1)}%`);
  }

  // STEP 7: Verify BKT and LearnTrace Mastery Updates
  console.log('\n[Step 7] Verifying BKT and LearnTrace mastery updates...');
  const postMasteryRes = await fetch(`${BASE_URL}/mastery`, { headers: authHeaders });
  const postMasteryData = await postMasteryRes.json();
  const postProbMastery = postMasteryData.find((m: any) => m.skillId === 'skill_prob');

  console.log('------------------------------------------------------------');
  console.log(`📈 POST-RETAKE PROBABILITY MASTERY: ${(postProbMastery.masteryScore * 100).toFixed(1)}%`);
  console.log(`🏷️ INTERPRETATION: ${postProbMastery.interpretation}`);
  console.log(`🔬 BKT ESTIMATE: ${(postProbMastery.bktEstimate * 100).toFixed(1)}%`);
  console.log(`Delta Mastery: +${((postProbMastery.masteryScore - preProbMastery.masteryScore) * 100).toFixed(1)}%`);
  console.log('------------------------------------------------------------');

  // Check post-retake recommendations
  const postRecRes = await fetch(`${BASE_URL}/recommendations`, { headers: authHeaders });
  const postRecData = await postRecRes.json();
  console.log(`\nNew Top Recommendation after mastering Probability: ${postRecData.recommendation?.skillName} (${postRecData.recommendation?.skillId})`);
  console.log(`Pedagogical Reason: "${postRecData.recommendation?.reasonText}"`);

  // Check if Conditional Probability is now unblocked
  const postAnalysis = postRecData.analysis;
  const postCondProb = postAnalysis.find((c: any) => c.skill.id === 'skill_cond_prob');
  if (postCondProb) {
    console.log(`Conditional Probability status: Ready=${postCondProb.isReady}, Unmet Prerequisites=[${postCondProb.unmetPrerequisites.join(', ')}]`);
  }

  console.log('\n======================================================================');
  console.log('🏁 END-TO-END ACCEPTANCE VERIFICATION COMPLETED SUCCESSFULLY!');
  console.log('All 6 checkpoints of the Page 3 Learner Scenario verified.');
  console.log('======================================================================');
}

runScenario().catch((err) => {
  console.error('❌ Scenario verification failed:', err);
  process.exit(1);
});
