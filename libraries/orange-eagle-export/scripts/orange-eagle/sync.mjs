export function decideSyncAction(identity, matches) {
  if (matches.length === 0) {
    return { identity, action: "add", item: null };
  }
  if (matches.length === 1) {
    return { identity, action: "replace", item: matches[0] };
  }
  return { identity, action: "conflict", items: matches };
}

export function summarizeActions(actions) {
  const summary = { add: 0, replace: 0, conflict: 0 };
  for (const { action } of actions) summary[action] += 1;
  return summary;
}

export async function retryOperation(operation, maxAttempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await operation(attempt);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}
