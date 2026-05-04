import { Authcontext } from "../auth.context";
import { useContext, useEffect } from "react";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {

    const context = useContext(Authcontext)
    const { user, setUser, loading, setLoading } = context

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            setUser(data.user)
        } catch (error) {
            // console.log(error)
        }
        finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            setUser(data.user)
        } catch (error) {

        }
        finally {
            setLoading(false)
        }

    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            const data = await logout()
            setUser(null)
        } catch (error) {

        }
        finally {
            setLoading(false)
        }

    }

    useEffect(() => {
        const getAndsetUser = async() =>{
            try {
                const data = await getMe()
                if (data && data.user) {
                    setUser(data.user)
                } else {
                    setUser(null)
                }
            } catch (error) {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        getAndsetUser()
    },[])

    return { user, loading, handleLogin, handleLogout, handleRegister }
}



