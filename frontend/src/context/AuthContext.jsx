import { createContext,useContext,useEffect,useState } from 'react';
import { getSession,getUserProfile } from '../services/auth.service';
const AuthContext=createContext(null);
export function AuthProvider({children}){
  const [profile,setProfile]=useState(null);
  const [loading,setLoading]=useState(true);
  
  useEffect(()=>{
    const s=getSession();
    if(s?.token) {
      getUserProfile().then(r => setProfile(r.data?.user || r.data || null)).finally(()=>setLoading(false));
    } else {
      setLoading(false);
    }
  },[]);
  
  const setProfileAfterAuth=async(user)=>setProfile(user);
  return <AuthContext.Provider value={{profile,loading,setProfileAfterAuth}}>{children}</AuthContext.Provider>
}
export const useAuth=()=>useContext(AuthContext);
