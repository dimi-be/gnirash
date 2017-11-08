export class Claims {
  public readonly keyHash: string
  public readonly name: string
  public readonly loggedIn: boolean
  public readonly expiresIn: string

  public constructor(keyHash: string, name: string, loggedIn: boolean, expiresIn: string) {
    this.keyHash = keyHash
    this.name = name
    this.loggedIn = loggedIn
    this.expiresIn = expiresIn
  }
}
