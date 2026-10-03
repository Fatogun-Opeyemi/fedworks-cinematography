// Lightweight global playback coordinator: ensures only one video plays at a time
const registeredPlayers = new Set()

export const videoCoordinator = {
  register(playerRef) {
    if (playerRef) registeredPlayers.add(playerRef)
  },
  unregister(playerRef) {
    if (playerRef) registeredPlayers.delete(playerRef)
  },
  notifyPlay(activePlayerRef) {
    registeredPlayers.forEach((ref) => {
      if (ref && ref !== activePlayerRef && typeof ref.pause === 'function') {
        ref.pause()
      }
    })
  },
}
