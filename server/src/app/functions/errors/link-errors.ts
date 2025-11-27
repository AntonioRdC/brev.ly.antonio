export class ShortCodeAlreadyExistsError extends Error {
  constructor() {
    super('Short code already exists')
  }
}

export class InvalidUrlFormatError extends Error {
  constructor() {
    super('Invalid URL format')
  }
}

export class LinkNotFoundError extends Error {
  constructor() {
    super('Link not found')
  }
}
