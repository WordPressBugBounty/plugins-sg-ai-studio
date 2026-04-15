type SafeParseResult<T> = { success: true; data: T } | { success: false; error: Error };

export function safeParseJson<T>(input: string): SafeParseResult<T> {
  try {
    const parsed = JSON.parse(input);
    return { success: true, data: parsed as T };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err : new Error(String(err)),
    };
  }
}
