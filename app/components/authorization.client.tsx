// import * as React from 'react';
// import { createContext, useState } from 'react';
// // import { useLocation } from '@remix-run/react';
// // import { useAuth0 } from '@auth0/auth0-react';
// // import LinearProgress from '@mui/material/LinearProgress';

// const AuthorizationComponent = (props: any) => {

//   const { children } = props;
  
//   // const location = useLocation();
//   // const [isHomePath, setIsHomePath] = useState(false);
//   // const {
//   //   isLoading,
//   //   isAuthenticated,
//   //   error,
//   //   // user,
//   // } = useAuth0();

//   // React.useEffect(() => {
//   //   if (location.pathname === '/') {
//   //     setIsHomePath(true);
//   //   } else {
//   //     setIsHomePath(false);
//   //   }
//     // console.log('isHomePath', isHomePath);
//   // }, [location, isHomePath, setIsHomePath]);

//   // if (isLoading) {
//   //   return (
//   //     <main>
//   //       <h1>
//   //         Loading...
//   //       </h1>
//   //       <LinearProgress color="success" />
//   //     </main>
//   //   );
//   // }
  
//   // if (error) {
//   //   return (
//   //     <main>
//   //       <h1>
//   //         500 Internal Server Error
//   //       </h1>
//   //       <pre>
//   //         {error.message}
//   //       </pre>
//   //     </main>
//   //   );
//   // }

//   // if (!isAuthenticated && !isHomePath) {
//   //   return (
//   //     <main>
//   //       <h1>
//   //         401 Unauthorized
//   //       </h1>
//   //     </main>
//   //   );
//   // }

//   return (
//     <React.Fragment>
//       {children}
//     </React.Fragment>
//   );
// }

// export default AuthorizationComponent;
