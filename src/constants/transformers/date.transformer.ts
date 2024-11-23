export class DateTransformer {
  to(data: Date | null): string | null {
    return data ? data.toISOString() : null;
  }
  from(data: string | null): Date | null {
    return data ? new Date(data) : null;
  }
}
