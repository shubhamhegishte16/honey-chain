const STORAGE_KEY = 'honeychain_learning_progress';

export function getProgress() {
  try {
    const data = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('honeychain_learning_progress');
    return data ? JSON.parse(data) : {};
  } catch (err) {
    console.error('Error loading learning progress:', err);
    return {};
  }
}

export function isResourceCompleted(resourceId) {
  if (!resourceId) return false;
  const progress = getProgress();
  return !!progress[resourceId]?.completed;
}

export function toggleResourceCompletion(resourceId) {
  if (!resourceId) return false;
  const progress = getProgress();
  const current = !!progress[resourceId]?.completed;
  
  progress[resourceId] = {
    completed: !current,
    updatedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    window.dispatchEvent(new Event('learning_progress_updated'));
  } catch (err) {
    console.error('Error saving learning progress:', err);
  }

  return !current;
}

export function markResourceCompleted(resourceId) {
  if (!resourceId) return;
  const progress = getProgress();
  if (progress[resourceId]?.completed) return;

  progress[resourceId] = {
    completed: true,
    updatedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    window.dispatchEvent(new Event('learning_progress_updated'));
  } catch (err) {
    console.error('Error saving learning progress:', err);
  }
}

export function calculateProgressStats(resources = [], categoryMap = {}) {
  const progress = getProgress();
  const totalResources = resources.length;
  if (totalResources === 0) {
    return { overallPercentage: 0, completedCount: 0, totalCount: 0, categoryBreakdown: [] };
  }

  let completedCount = 0;
  resources.forEach(res => {
    const id = res._id || res.id;
    if (progress[id]?.completed) {
      completedCount++;
    }
  });

  const overallPercentage = Math.round((completedCount / totalResources) * 100);

  // Category breakdown
  const categoryStats = {};
  
  // Initialize categories
  Object.keys(categoryMap).forEach(catKey => {
    categoryStats[catKey] = {
      key: catKey,
      label: categoryMap[catKey].label,
      total: 0,
      completed: 0
    };
  });

  resources.forEach(res => {
    const id = res._id || res.id;
    const isComp = !!progress[id]?.completed;
    
    // Find matching category key
    Object.entries(categoryMap).forEach(([catKey, catInfo]) => {
      if (catInfo.dbCategories.includes(res.category)) {
        categoryStats[catKey].total += 1;
        if (isComp) categoryStats[catKey].completed += 1;
      }
    });
  });

  const categoryBreakdown = Object.values(categoryStats).map(cat => ({
    ...cat,
    percentage: cat.total > 0 ? Math.round((cat.completed / cat.total) * 100) : 0
  }));

  return {
    overallPercentage,
    completedCount,
    totalCount: totalResources,
    categoryBreakdown
  };
}
