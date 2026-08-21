const INTERESTS_STORAGE_KEY = 'woolconnect_user_interests';
const LAST_PROBLEM_STORAGE_KEY = 'woolconnect_last_selected_problem';

export function getUserInterests() {
  try {
    const data = localStorage.getItem(INTERESTS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error getting user interests:', err);
    return [];
  }
}

export function saveUserInterests(interests = []) {
  try {
    localStorage.setItem(INTERESTS_STORAGE_KEY, JSON.stringify(interests));
    window.dispatchEvent(new Event('user_interests_updated'));
  } catch (err) {
    console.error('Error saving user interests:', err);
  }
}

export function toggleUserInterest(interestKey) {
  const current = getUserInterests();
  const exists = current.includes(interestKey);
  const updated = exists ? current.filter(i => i !== interestKey) : [...current, interestKey];
  saveUserInterests(updated);
  return updated;
}

export function getLastSelectedProblem() {
  try {
    return localStorage.getItem(LAST_PROBLEM_STORAGE_KEY) || null;
  } catch (err) {
    return null;
  }
}

export function setLastSelectedProblem(problemId) {
  try {
    if (problemId) {
      localStorage.setItem(LAST_PROBLEM_STORAGE_KEY, problemId);
    } else {
      localStorage.removeItem(LAST_PROBLEM_STORAGE_KEY);
    }
    window.dispatchEvent(new Event('user_problem_updated'));
  } catch (err) {
    console.error('Error setting last selected problem:', err);
  }
}

export function getCurrentSeasonKey() {
  const currentMonth = new Date().getMonth();
  if ([5, 6, 7, 8].includes(currentMonth)) return 'monsoon';
  if ([9, 10, 11, 0].includes(currentMonth)) return 'shearing';
  return 'processing';
}

/**
 * Score resources based on rule system:
 * - +3 problem matches (targetProblems)
 * - +2 season matches (recommendedSeasons)
 * - +2 interest/category matches (interests or matching category)
 * - +1 resource is NOT completed
 */
export function getSmartRecommendations(resources = [], userProgress = {}) {
  if (!resources || resources.length === 0) return [];

  const userInterests = getUserInterests();
  const currentSeason = getCurrentSeasonKey();
  const lastProblem = getLastSelectedProblem();

  const scored = resources.map(res => {
    let score = 0;
    const resId = res._id || res.id;
    const isCompleted = !!userProgress[resId]?.completed;

    // 1. Problem match (+3)
    if (lastProblem && res.targetProblems && Array.isArray(res.targetProblems)) {
      if (res.targetProblems.includes(lastProblem)) {
        score += 3;
      }
    }

    // 2. Season match (+2)
    if (res.recommendedSeasons && Array.isArray(res.recommendedSeasons)) {
      if (res.recommendedSeasons.includes(currentSeason)) {
        score += 2;
      }
    }

    // 3. Interest match (+2)
    if (userInterests.length > 0) {
      const matchesExplicitInterest = res.interests && Array.isArray(res.interests) && res.interests.some(i => userInterests.includes(i));
      
      // Also map category to interest keys
      const categoryToInterest = {
        'Sheep Management': 'sheep-care',
        'Wool Shearing': 'shearing',
        'Wool Handling': 'wool-quality',
        'Wool Grading': 'wool-quality',
        'Wool Storage': 'storage',
        'Wool Processing': 'processing',
        'Dyeing': 'processing',
        'Product Development': 'processing',
        'Marketing': 'selling',
        'Digital Selling': 'selling'
      };
      
      const mappedInterest = categoryToInterest[res.category];
      const matchesCategoryInterest = mappedInterest && userInterests.includes(mappedInterest);

      if (matchesExplicitInterest || matchesCategoryInterest) {
        score += 2;
      }
    }

    // 4. Incomplete bonus (+1)
    if (!isCompleted) {
      score += 1;
    }

    return {
      resource: res,
      score,
      isCompleted
    };
  });

  // Sort descending by score, prioritizing incomplete items if scores tie
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
    return (b.resource.views || 0) - (a.resource.views || 0);
  });

  // Pick top 3-5 recommendations
  let recommendations = scored.filter(item => !item.isCompleted).map(item => item.resource);

  // Fallback: if not enough incomplete recommendations, fill up with overall top scoring items
  if (recommendations.length < 3) {
    recommendations = scored.slice(0, 4).map(item => item.resource);
  }

  return recommendations.slice(0, 4);
}
