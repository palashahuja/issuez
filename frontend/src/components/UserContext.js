import { createContext } from 'react';
const UserContext = createContext({ userid: 1, setUserId: () => {}});


export default UserContext;