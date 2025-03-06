import {create} from 'zustand'
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

type UserStore={
    user:{
        username?:string
    },
    token:string,
    setToken:(val:string)=>void
    setUser:(val:any)=>void,
    lougoutUser:()=>void,
    authUser:(loginData:{username:string, password:string})=>Promise<object>
}

export const useUserStore =create<UserStore>()(
    persist(
        (set)=>({
            token:Cookies.get('token') || '',
            user:{},
            setToken:(val:string)=>{
                Cookies.set('token', val, { expires: 1, path: '/' })
                set({token:val})
            },
            setUser:(val)=>{
                set({user:val})
            },
            authUser:(loginData)=>{
                return new Promise((resolve, reject)=>{
                    if(loginData.username=='admin'){
                        Cookies.set('token', "TOKEN", { expires: 1, path: '/' })
                        set({token:"TOKEN", user:loginData})
                        return resolve({
                            message:"Success"
                        })
                    }
                    else{
                        return reject({
                            message:"Error"
                        })
                    }
                })
            },
            lougoutUser:()=>{
                Cookies.set('token', "", { expires: 1, path: '/' })
                set({token:"", user:{}})
            }
        }),
        {
            name: 'PROMAUSER', 
            partialize: (state) => ({ 
                user: state.user 
            })
        }    
    )
);