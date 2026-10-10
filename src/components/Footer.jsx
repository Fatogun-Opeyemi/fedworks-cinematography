// import React from 'react'
// import { Link } from 'react-router-dom'

// export default function Footer() {
//   return (
//     <footer className="minimal-cinematic-footer">
//       <div className="site-container">
//         <div className="minimal-footer-inner">
//           {/* Identity */}
//           <div className="minimal-footer-brand">
//             <Link to="/" className="minimal-footer-title">
//               Chukwuka Edeogu (Fedworks)
//             </Link>
//             <div className="minimal-footer-subtitle">
//               DIRECTOR OF PHOTOGRAPHY
//             </div>
//           </div>

//           {/* Copyright */}
//           <div className="minimal-footer-copy tabular-nums">
//             © {new Date().getFullYear()} Chukwuka Edeogu (Fedworks)
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }


import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="minimal-cinematic-footer">
      <div className="site-container">
        <div className="minimal-footer-inner">
          <div className="minimal-footer-brand">
            <Link to="/" className="minimal-footer-title">
              Chukwuka Edeogu (Fedworks)
            </Link>

            <div className="minimal-footer-subtitle">
              DIRECTOR OF PHOTOGRAPHY
            </div>
          </div>

          {/* <div className="minimal-footer-copy tabular-nums">
            © {new Date().getFullYear()}
          </div> */}
        </div>
      </div>
    </footer>
  )
}
