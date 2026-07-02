export const SESSION_EXPIRED_SAFETY = 30 // secondes

export const isExpired = (expireTimestampRaw: Date) => {
  const currentTimestamp = Math.floor(Date.now() / 1000)
  const expireTimestamp = expireTimestampRaw.getTime() / 1000

  return currentTimestamp > expireTimestamp - SESSION_EXPIRED_SAFETY
}
