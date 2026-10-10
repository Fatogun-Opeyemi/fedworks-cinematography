// import React, {
//   forwardRef,
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
// } from 'react'

// const formatTime = (time) => {
//   if (!Number.isFinite(time) || time < 0) return '0:00'

//   const totalSeconds = Math.floor(time)
//   const minutes = Math.floor(totalSeconds / 60)
//   const seconds = totalSeconds % 60

//   return `${minutes}:${String(seconds).padStart(2, '0')}`
// }

// const VideoPlayer = forwardRef(function VideoPlayer(
//   {
//     videoSrc,
//     posterSrc,
//     aspectRatio = '16/9',
//     title = 'Cinematography sequence',
//     className = '',
//     controls = true,
//     showVolumeControls = true,
//     muted = false,
//     loop = false,
//     autoPlay = false,
//     playsInline = true,
//     preload = 'metadata',
//     onPlay,
//     onPause,
//     onEnded,
//     onError,
//   },
//   forwardedRef,
// ) {
//   const playerRef = useRef(null)
//   const videoRef = useRef(null)
//   const seekRef = useRef(null)
//   const hideControlsTimer = useRef(null)

//   const [isPlaying, setIsPlaying] = useState(false)
//   const [isMuted, setIsMuted] = useState(Boolean(muted))
//   const [volume, setVolume] = useState(muted ? 0 : 1)
//   const [currentTime, setCurrentTime] = useState(0)
//   const [duration, setDuration] = useState(0)
//   const [isFullscreen, setIsFullscreen] = useState(false)
//   const [isSeeking, setIsSeeking] = useState(false)
//   const [isLoaded, setIsLoaded] = useState(false)
//   const [hasError, setHasError] = useState(false)
//   const [showControls, setShowControls] = useState(true)
//   const [hasStarted, setHasStarted] = useState(false)

//   const setVideoRef = useCallback(
//     (node) => {
//       videoRef.current = node

//       if (typeof forwardedRef === 'function') {
//         forwardedRef(node)
//       } else if (forwardedRef) {
//         forwardedRef.current = node
//       }
//     },
//     [forwardedRef],
//   )

//   const clearHideTimer = useCallback(() => {
//     if (hideControlsTimer.current) {
//       window.clearTimeout(hideControlsTimer.current)
//       hideControlsTimer.current = null
//     }
//   }, [])

//   const hideControlsSoon = useCallback(() => {
//     clearHideTimer()

//     if (!isPlaying) return

//     hideControlsTimer.current = window.setTimeout(() => {
//       setShowControls(false)
//     }, 2200)
//   }, [clearHideTimer, isPlaying])

//   const revealControls = useCallback(() => {
//     setShowControls(true)
//     hideControlsSoon()
//   }, [hideControlsSoon])

//   useEffect(() => {
//     return () => {
//       clearHideTimer()
//     }
//   }, [clearHideTimer])

//   useEffect(() => {
//     const video = videoRef.current

//     if (!video) return

//     video.muted = isMuted
//     video.volume = isMuted ? 0 : volume
//   }, [isMuted, volume])

//   useEffect(() => {
//     const video = videoRef.current

//     if (!video) return

//     video.loop = loop
//   }, [loop])

//   useEffect(() => {
//     const video = videoRef.current

//     if (!video || !videoSrc) return

//     setIsLoaded(false)
//     setHasError(false)
//     setCurrentTime(0)
//     setDuration(0)
//     setIsPlaying(false)
//     setHasStarted(false)

//     video.pause()
//     video.load()

//     if (autoPlay) {
//       const attemptAutoplay = async () => {
//         try {
//           await video.play()

//           setIsPlaying(true)
//           setHasStarted(true)
//           onPlay?.()
//         } catch {
//           // Browser autoplay policy may block playback.
//         }
//       }

//       attemptAutoplay()
//     }
//   }, [videoSrc, autoPlay, onPlay])

//   useEffect(() => {
//     const handleFullscreenChange = () => {
//       const fullscreenElement =
//         document.fullscreenElement ||
//         document.webkitFullscreenElement

//       setIsFullscreen(fullscreenElement === playerRef.current)
//     }

//     document.addEventListener(
//       'fullscreenchange',
//       handleFullscreenChange,
//     )

//     document.addEventListener(
//       'webkitfullscreenchange',
//       handleFullscreenChange,
//     )

//     return () => {
//       document.removeEventListener(
//         'fullscreenchange',
//         handleFullscreenChange,
//       )

//       document.removeEventListener(
//         'webkitfullscreenchange',
//         handleFullscreenChange,
//       )
//     }
//   }, [])

//   const togglePlay = useCallback(
//     async (event) => {
//       event?.preventDefault()
//       event?.stopPropagation()

//       const video = videoRef.current

//       if (!video || hasError) return

//       try {
//         if (video.paused || video.ended) {
//           await video.play()

//           setIsPlaying(true)
//           setHasStarted(true)
//           setShowControls(true)

//           onPlay?.()
//           hideControlsSoon()
//         } else {
//           video.pause()

//           setIsPlaying(false)
//           setShowControls(true)

//           clearHideTimer()
//           onPause?.()
//         }
//       } catch {
//         setHasError(true)
//       }
//     },
//     [
//       clearHideTimer,
//       hasError,
//       hideControlsSoon,
//       onPause,
//       onPlay,
//     ],
//   )

//   const handleLoadedMetadata = () => {
//     const video = videoRef.current

//     if (!video) return

//     setDuration(
//       Number.isFinite(video.duration)
//         ? video.duration
//         : 0,
//     )

//     setIsLoaded(true)
//   }

//   const handleLoadedData = () => {
//     setIsLoaded(true)
//   }

//   const handleTimeUpdate = () => {
//     const video = videoRef.current

//     if (!video || isSeeking) return

//     setCurrentTime(video.currentTime)
//   }

//   const handlePlay = () => {
//     setIsPlaying(true)
//     setHasStarted(true)
//     onPlay?.()
//     hideControlsSoon()
//   }

//   const handlePause = () => {
//     setIsPlaying(false)
//     setShowControls(true)
//     clearHideTimer()
//     onPause?.()
//   }

//   const handleEnded = () => {
//     setIsPlaying(false)
//     setCurrentTime(0)
//     setShowControls(true)
//     clearHideTimer()
//     onEnded?.()
//   }

//   const handleVideoError = (event) => {
//     setHasError(true)
//     setIsPlaying(false)
//     setIsLoaded(false)
//     setShowControls(true)
//     onError?.(event)
//   }

//   const getSeekTimeFromPointer = (event) => {
//     const seekElement = seekRef.current

//     if (!seekElement || !duration) return 0

//     const rect = seekElement.getBoundingClientRect()

//     if (!rect.width) return 0

//     const position = Math.min(
//       Math.max(event.clientX - rect.left, 0),
//       rect.width,
//     )

//     return (position / rect.width) * duration
//   }

//   const updateSeekFromPointer = (event) => {
//     const video = videoRef.current

//     if (!video || !duration) return

//     const nextTime = getSeekTimeFromPointer(event)

//     video.currentTime = nextTime
//     setCurrentTime(nextTime)
//   }

//   const handleSeekPointerDown = (event) => {
//     event.preventDefault()
//     event.stopPropagation()

//     setIsSeeking(true)
//     revealControls()

//     seekRef.current?.setPointerCapture?.(
//       event.pointerId,
//     )

//     updateSeekFromPointer(event)
//   }

//   const handleSeekPointerMove = (event) => {
//     if (!isSeeking) return

//     event.preventDefault()

//     updateSeekFromPointer(event)
//   }

//   const handleSeekPointerUp = (event) => {
//     if (!isSeeking) return

//     event.preventDefault()

//     setIsSeeking(false)

//     try {
//       seekRef.current?.releasePointerCapture?.(
//         event.pointerId,
//       )
//     } catch {
//       // Pointer capture may already have been released.
//     }
//   }

//   const handleSeekKeyDown = (event) => {
//     if (!duration) return

//     let nextTime = currentTime

//     if (event.key === 'ArrowLeft') {
//       nextTime = Math.max(0, currentTime - 5)
//     } else if (event.key === 'ArrowRight') {
//       nextTime = Math.min(
//         duration,
//         currentTime + 5,
//       )
//     } else if (event.key === 'Home') {
//       nextTime = 0
//     } else if (event.key === 'End') {
//       nextTime = duration
//     } else {
//       return
//     }

//     event.preventDefault()

//     const video = videoRef.current

//     if (video) {
//       video.currentTime = nextTime
//       setCurrentTime(nextTime)
//     }
//   }

//   const handleVolumeChange = (event) => {
//     if (!showVolumeControls) return

//     const nextVolume = Number(event.target.value)

//     setVolume(nextVolume)

//     const video = videoRef.current

//     if (!video) return

//     video.volume = nextVolume

//     if (nextVolume === 0) {
//       video.muted = true
//       setIsMuted(true)
//     } else {
//       video.muted = false
//       setIsMuted(false)
//     }

//     revealControls()
//   }

//   const toggleMute = (event) => {
//     if (!showVolumeControls) return

//     event.preventDefault()
//     event.stopPropagation()

//     const video = videoRef.current

//     if (!video) return

//     if (video.muted || video.volume === 0) {
//       const restoredVolume =
//         volume > 0 ? volume : 1

//       video.muted = false
//       video.volume = restoredVolume

//       setVolume(restoredVolume)
//       setIsMuted(false)
//     } else {
//       video.muted = true
//       setIsMuted(true)
//     }

//     revealControls()
//   }

//   const toggleFullscreen = async (event) => {
//     event.preventDefault()
//     event.stopPropagation()

//     const player = playerRef.current
//     const video = videoRef.current

//     if (!player) return

//     try {
//       const fullscreenElement =
//         document.fullscreenElement ||
//         document.webkitFullscreenElement

//       if (!fullscreenElement) {
//         if (player.requestFullscreen) {
//           await player.requestFullscreen()
//         } else if (player.webkitRequestFullscreen) {
//           await player.webkitRequestFullscreen()
//         } else if (video?.webkitEnterFullscreen) {
//           video.webkitEnterFullscreen()
//         }
//       } else {
//         if (document.exitFullscreen) {
//           await document.exitFullscreen()
//         } else if (document.webkitExitFullscreen) {
//           await document.webkitExitFullscreen()
//         }
//       }
//     } catch {
//       // Fullscreen can be rejected by browser permissions/policy.
//     }

//     revealControls()
//   }

//   const handlePlayerKeyDown = (event) => {
//     if (
//       event.target instanceof HTMLInputElement ||
//       event.target instanceof HTMLButtonElement ||
//       event.target === seekRef.current
//     ) {
//       return
//     }

//     switch (event.key) {
//       case ' ':
//       case 'k':
//       case 'K':
//         event.preventDefault()
//         togglePlay(event)
//         break

//       case 'm':
//       case 'M':
//         if (!showVolumeControls) break

//         event.preventDefault()
//         toggleMute(event)
//         break

//       case 'ArrowUp': {
//         if (!showVolumeControls) break

//         event.preventDefault()

//         const video = videoRef.current

//         const nextVolume = Math.min(
//           1,
//           volume + 0.1,
//         )

//         setVolume(nextVolume)
//         setIsMuted(false)

//         if (video) {
//           video.volume = nextVolume
//           video.muted = false
//         }

//         break
//       }

//       case 'ArrowDown': {
//         if (!showVolumeControls) break

//         event.preventDefault()

//         const video = videoRef.current

//         const nextVolume = Math.max(
//           0,
//           volume - 0.1,
//         )

//         setVolume(nextVolume)
//         setIsMuted(nextVolume === 0)

//         if (video) {
//           video.volume = nextVolume
//           video.muted = nextVolume === 0
//         }

//         break
//       }

//       case 'f':
//       case 'F':
//         event.preventDefault()
//         toggleFullscreen(event)
//         break

//       case 'ArrowLeft':
//         if (videoRef.current) {
//           event.preventDefault()

//           videoRef.current.currentTime =
//             Math.max(
//               0,
//               videoRef.current.currentTime - 5,
//             )

//           setCurrentTime(
//             videoRef.current.currentTime,
//           )
//         }
//         break

//       case 'ArrowRight':
//         if (videoRef.current) {
//           event.preventDefault()

//           videoRef.current.currentTime =
//             Math.min(
//               duration,
//               videoRef.current.currentTime + 5,
//             )

//           setCurrentTime(
//             videoRef.current.currentTime,
//           )
//         }
//         break

//       default:
//         break
//     }
//   }

//   const progressPercentage =
//     duration > 0
//       ? Math.min(
//         100,
//         Math.max(
//           0,
//           (currentTime / duration) * 100,
//         ),
//       )
//       : 0

//   const volumePercentage = isMuted
//     ? 0
//     : volume * 100

//   return (
//     <div
//       ref={playerRef}
//       className={[
//         'video-player-root',
//         isFullscreen ? 'is-fullscreen' : '',
//         className,
//       ]
//         .filter(Boolean)
//         .join(' ')}
//       style={{ aspectRatio }}
//       tabIndex={0}
//       role="region"
//       aria-label={title}
//       onKeyDown={handlePlayerKeyDown}
//       onMouseMove={revealControls}
//       onMouseEnter={revealControls}
//       onTouchStart={revealControls}
//     >
//       <video
//         ref={setVideoRef}
//         src={videoSrc || undefined}
//         poster={posterSrc || undefined}
//         className="video-player-video"
//         muted={isMuted}
//         loop={loop}
//         playsInline={playsInline}
//         preload={preload}
//         onLoadedMetadata={handleLoadedMetadata}
//         onLoadedData={handleLoadedData}
//         onTimeUpdate={handleTimeUpdate}
//         onPlay={handlePlay}
//         onPause={handlePause}
//         onEnded={handleEnded}
//         onError={handleVideoError}
//         onClick={togglePlay}
//         aria-label={title}
//       />

//       {posterSrc && !hasStarted && !hasError && (
//         <div
//           className="video-player-poster-layer"
//           style={{
//             backgroundImage: `url("${posterSrc}")`,
//           }}
//           aria-hidden="true"
//         />
//       )}

//       {!isLoaded && !hasError && (
//         <div
//           className="video-player-loading"
//           aria-hidden="true"
//         >
//           <span className="video-player-loading-dot" />
//         </div>
//       )}

//       {hasError && (
//         <div className="video-player-error">
//           <span>Video unavailable</span>
//         </div>
//       )}

//       {!isPlaying && !hasError && (
//         <button
//           type="button"
//           className="video-player-center-button"
//           onClick={togglePlay}
//           aria-label={`Play ${title}`}
//         >
//           <svg
//             viewBox="0 0 24 24"
//             fill="currentColor"
//             aria-hidden="true"
//             focusable="false"
//           >
//             <polygon points="7 4 20 12 7 20 7 4" />
//           </svg>
//         </button>
//       )}

//       {controls && !hasError && (
//         <div
//           className={[
//             'video-player-controls',
//             showControls || !isPlaying
//               ? 'is-visible'
//               : '',
//           ]
//             .filter(Boolean)
//             .join(' ')}
//         >
//           <div
//             ref={seekRef}
//             className="video-player-seek"
//             role="slider"
//             tabIndex={0}
//             aria-label="Video progress"
//             aria-valuemin={0}
//             aria-valuemax={duration || 0}
//             aria-valuenow={currentTime}
//             onPointerDown={handleSeekPointerDown}
//             onPointerMove={handleSeekPointerMove}
//             onPointerUp={handleSeekPointerUp}
//             onPointerCancel={handleSeekPointerUp}
//             onKeyDown={handleSeekKeyDown}
//           >
//             <div className="video-player-seek-track">
//               <div
//                 className="video-player-seek-fill"
//                 style={{
//                   width: `${progressPercentage}%`,
//                 }}
//               />

//               <div
//                 className="video-player-seek-thumb"
//                 style={{
//                   left: `${progressPercentage}%`,
//                 }}
//               />
//             </div>
//           </div>

//           <div className="video-player-controls-row">
//             <div className="video-player-controls-left">
//               <button
//                 type="button"
//                 className="video-player-control"
//                 onClick={togglePlay}
//                 aria-label={
//                   isPlaying
//                     ? 'Pause video'
//                     : 'Play video'
//                 }
//               >
//                 {isPlaying ? (
//                   <svg
//                     viewBox="0 0 24 24"
//                     fill="currentColor"
//                     aria-hidden="true"
//                   >
//                     <rect
//                       x="6"
//                       y="5"
//                       width="4"
//                       height="14"
//                     />

//                     <rect
//                       x="14"
//                       y="5"
//                       width="4"
//                       height="14"
//                     />
//                   </svg>
//                 ) : (
//                   <svg
//                     viewBox="0 0 24 24"
//                     fill="currentColor"
//                     aria-hidden="true"
//                   >
//                     <polygon points="7 4 20 12 7 20 7 4" />
//                   </svg>
//                 )}
//               </button>

//               {showVolumeControls && (
//                 <>
//                   <button
//                     type="button"
//                     className="video-player-control"
//                     onClick={toggleMute}
//                     aria-label={
//                       isMuted
//                         ? 'Unmute video'
//                         : 'Mute video'
//                     }
//                     aria-pressed={isMuted}
//                   >
//                     {isMuted || volume === 0 ? (
//                       <svg
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="1.8"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         aria-hidden="true"
//                       >
//                         <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />

//                         <line
//                           x1="23"
//                           y1="9"
//                           x2="17"
//                           y2="15"
//                         />

//                         <line
//                           x1="17"
//                           y1="9"
//                           x2="23"
//                           y2="15"
//                         />
//                       </svg>
//                     ) : (
//                       <svg
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="1.8"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         aria-hidden="true"
//                       >
//                         <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />

//                         <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />

//                         <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
//                       </svg>
//                     )}
//                   </button>

//                   <input
//                     className="video-player-volume"
//                     type="range"
//                     min="0"
//                     max="1"
//                     step="0.01"
//                     value={volumePercentage / 100}
//                     onChange={handleVolumeChange}
//                     aria-label="Volume"
//                   />
//                 </>
//               )}

//               <span className="video-player-time">
//                 {formatTime(currentTime)} /{' '}
//                 {formatTime(duration)}
//               </span>
//             </div>

//             <button
//               type="button"
//               className="video-player-control"
//               onClick={toggleFullscreen}
//               aria-label={
//                 isFullscreen
//                   ? 'Exit fullscreen'
//                   : 'Enter fullscreen'
//               }
//             >
//               {isFullscreen ? (
//                 <svg
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="1.8"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   aria-hidden="true"
//                 >
//                   <polyline points="9 15 4 15 4 20" />

//                   <polyline points="15 9 20 9 20 4" />

//                   <line
//                     x1="14"
//                     y1="10"
//                     x2="20"
//                     y2="4"
//                   />

//                   <line
//                     x1="4"
//                     y1="20"
//                     x2="10"
//                     y2="14"
//                   />
//                 </svg>
//               ) : (
//                 <svg
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="1.8"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   aria-hidden="true"
//                 >
//                   <polyline points="8 3 5 3 5 8" />

//                   <polyline points="16 3 19 3 19 8" />

//                   <polyline points="8 21 5 21 5 16" />

//                   <polyline points="16 21 19 21 19 16" />
//                 </svg>
//               )}
//             </button>
//           </div>
//         </div>
//       )}

//       <style>{`
//         .video-player-root {
//           --player-accent: #9e2f2b;
//           position: relative;
//           width: 100%;
//           overflow: hidden;
//           background: #050505;
//           color: #fff;
//           outline: none;
//           isolation: isolate;
//         }

//         .video-player-root:focus-visible {
//           outline: 1px solid rgba(255, 255, 255, 0.7);
//           outline-offset: 3px;
//         }

//         .video-player-root:fullscreen,
//         .video-player-root.is-fullscreen {
//           width: 100vw;
//           height: 100vh;
//           max-width: none;
//           max-height: none;
//           aspect-ratio: auto !important;
//           background: #000;
//         }

//         .video-player-root:fullscreen .video-player-video,
//         .video-player-root.is-fullscreen .video-player-video {
//           width: 100%;
//           height: 100%;
//           object-fit: contain;
//         }

//         .video-player-video {
//           position: absolute;
//           inset: 0;
//           z-index: 1;
//           width: 100%;
//           height: 100%;
//           display: block;
//           object-fit: cover;
//           background: #000;
//         }

//         .video-player-poster-layer {
//           position: absolute;
//           inset: 0;
//           z-index: 2;
//           background-position: center;
//           background-repeat: no-repeat;
//           background-size: cover;
//           pointer-events: none;
//         }

//         .video-player-loading {
//           position: absolute;
//           inset: 0;
//           z-index: 4;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           pointer-events: none;
//         }

//         .video-player-loading-dot {
//           width: 7px;
//           height: 7px;
//           border-radius: 50%;
//           background: rgba(255, 255, 255, 0.85);
//           animation: fedworks-player-pulse 1s ease-in-out infinite;
//         }

//         @keyframes fedworks-player-pulse {
//           0%,
//           100% {
//             opacity: 0.25;
//             transform: scale(0.8);
//           }

//           50% {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }

//         .video-player-error {
//           position: absolute;
//           inset: 0;
//           z-index: 6;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background: #080808;
//           color: rgba(255, 255, 255, 0.7);
//           font-size: 0.75rem;
//           letter-spacing: 0.1em;
//           text-transform: uppercase;
//         }

//         .video-player-center-button {
//           position: absolute;
//           left: 50%;
//           top: 50%;
//           z-index: 8;
//           width: 64px;
//           height: 64px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 0;
//           transform: translate(-50%, -50%);
//           border: 1px solid rgba(255, 255, 255, 0.65);
//           border-radius: 50%;
//           background: rgba(0, 0, 0, 0.3);
//           color: #fff;
//           cursor: pointer;
//           backdrop-filter: blur(4px);
//           transition:
//             transform 180ms ease,
//             background 180ms ease,
//             border-color 180ms ease;
//         }

//         .video-player-center-button:hover {
//           transform: translate(-50%, -50%) scale(1.06);
//           background: rgba(0, 0, 0, 0.55);
//           border-color: rgba(255, 255, 255, 0.95);
//         }

//         .video-player-center-button svg {
//           width: 23px;
//           height: 23px;
//           margin-left: 3px;
//         }

//         .video-player-controls {
//           position: absolute;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           z-index: 10;
//           padding: 0 14px 12px;
//           opacity: 0;
//           transform: translateY(4px);
//           pointer-events: none;
//           background:
//             linear-gradient(
//               to top,
//               rgba(0, 0, 0, 0.72),
//               rgba(0, 0, 0, 0.25) 55%,
//               transparent
//             );
//           transition:
//             opacity 180ms ease,
//             transform 180ms ease;
//         }

//         .video-player-controls.is-visible {
//           opacity: 1;
//           transform: translateY(0);
//           pointer-events: auto;
//         }

//         .video-player-seek {
//           position: relative;
//           width: 100%;
//           height: 18px;
//           display: flex;
//           align-items: center;
//           cursor: pointer;
//           touch-action: none;
//           outline: none;
//         }

//         .video-player-seek-track {
//           position: relative;
//           width: 100%;
//           height: 3px;
//           background: rgba(255, 255, 255, 0.3);
//           transition: height 120ms ease;
//         }

//         .video-player-seek:hover .video-player-seek-track,
//         .video-player-seek:focus-visible .video-player-seek-track {
//           height: 4px;
//         }

//         .video-player-seek-fill {
//           position: absolute;
//           inset: 0 auto 0 0;
//           width: 0;
//           background: #fff;
//         }

//         .video-player-seek-thumb {
//           position: absolute;
//           top: 50%;
//           width: 9px;
//           height: 9px;
//           border-radius: 50%;
//           background: #fff;
//           transform: translate(-50%, -50%);
//           opacity: 0;
//           transition: opacity 120ms ease;
//         }

//         .video-player-seek:hover .video-player-seek-thumb,
//         .video-player-seek:focus-visible .video-player-seek-thumb {
//           opacity: 1;
//         }

//         .video-player-controls-row {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           gap: 10px;
//           min-height: 30px;
//         }

//         .video-player-controls-left {
//           min-width: 0;
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }

//         .video-player-control {
//           width: 30px;
//           height: 30px;
//           flex: 0 0 30px;
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           padding: 0;
//           border: 0;
//           background: transparent;
//           color: #fff;
//           cursor: pointer;
//           opacity: 0.9;
//           transition:
//             opacity 150ms ease,
//             transform 150ms ease;
//         }

//         .video-player-control:hover {
//           opacity: 1;
//           transform: scale(1.05);
//         }

//         .video-player-control svg {
//           width: 16px;
//           height: 16px;
//         }

//         .video-player-volume {
//           width: 62px;
//           height: 3px;
//           margin: 0 5px 0 0;
//           accent-color: #fff;
//           cursor: pointer;
//         }

//         .video-player-time {
//           min-width: max-content;
//           color: rgba(255, 255, 255, 0.9);
//           font-size: 0.68rem;
//           line-height: 1;
//           font-variant-numeric: tabular-nums;
//           white-space: nowrap;
//         }

//         @media (max-width: 600px) {
//           .video-player-controls {
//             padding: 0 9px 9px;
//           }

//           .video-player-volume {
//             display: none;
//           }

//           .video-player-control {
//             width: 28px;
//             height: 28px;
//             flex-basis: 28px;
//           }

//           .video-player-time {
//             font-size: 0.62rem;
//           }

//           .video-player-center-button {
//             width: 56px;
//             height: 56px;
//           }
//         }
//       `}</style>
//     </div>
//   )
// })

// export default VideoPlayer