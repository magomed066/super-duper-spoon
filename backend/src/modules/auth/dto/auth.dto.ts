export class LoginDto {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}

  static from(body: unknown): LoginDto {
    const payload = LoginDto.asRecord(body)

    return new LoginDto(
      String(payload.email ?? ''),
      String(payload.password ?? '')
    )
  }

  private static asRecord(body: unknown): Record<string, unknown> {
    // DTO stays resilient to malformed JSON bodies and missing payloads.
    return body !== null && typeof body === 'object'
      ? (body as Record<string, unknown>)
      : {}
  }
}

export class RefreshTokenDto {
  constructor(public readonly refreshToken: string) {}

  static from(body: unknown): RefreshTokenDto {
    const payload = RefreshTokenDto.asRecord(body)

    return new RefreshTokenDto(String(payload.refreshToken ?? ''))
  }

  private static asRecord(body: unknown): Record<string, unknown> {
    // Token endpoints accept a minimal body shape, so we normalize unknown input once here.
    return body !== null && typeof body === 'object'
      ? (body as Record<string, unknown>)
      : {}
  }
}
