'use client'

import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import Link from 'next/link'
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios, {AxiosError} from 'axios'
import { apiResponse } from '@/types/apiResponse'
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
  } from "@/components/ui/field"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const page = () => {
  //We are checking the username is available or not from the backend thats why we are goona useState for username
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false) // this is for  we submit the form
  const router = useRouter()
  const debounced = useDebounceCallback(setUsername, 500) // the value in the username is set after a delay of 500ms

  //Zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    }
  })

  useEffect(()=> {
    const checkUsernameUnique = async () => {
      if(username){
        setIsCheckingUsername(true);
        setUsername('')
        try{
          const response = await axios.get(`/api/check-username-unique?username=${username}`) // userurl nextjs prepend kar deta hai request me
          setUsernameMessage(response.data.message)
        }
        catch(error){
          const axiosError = error as AxiosError<apiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
        }
        finally{
        setIsCheckingUsername(false);
        }
      }
    }
    checkUsernameUnique()
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try{
      const response = await axios.post('/api/sign-up', data)
      toast.success(response.data.message)
      router.replace(`/verify/${username}`)
      setIsSubmitting(false)
    }catch(error){
      toast.error("error while sign-up")
      setIsSubmitting(false)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen w-full'>
        <div className='bg-gray-100 p-4 rounded-lg shadow-lg min-w-xl'>
            <h1 className='text-4xl font-semibold text-center'>Join Echoes</h1>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Controller
                name="username"
                control={form.control}
                render={({ field }) => (
                    <Field>
                        <FieldLabel>
                            Username
                        </FieldLabel>
                        <Input
                            {...field}
                            onChange={(e) => { 
                                // why i have to do it manually because i am handling it through useState
                                field.onChange(e)
                                debounced(e.target.value)
                            }}
                            placeholder="Please enter username"
                        />
                        {isCheckingUsername && <Loader2 className='animate-spin'/>}
                        <p className={`text-sm ${usernameMessage === "Username is unique" ? "text-green-500" : "text-red-500"}`}>test {usernameMessage}</p>
                    </Field>
                )}
                />
                <Controller
                name="email"
                control={form.control}
                render={({ field }) => (
                    <Field>
                        <FieldLabel>
                            Email Id
                        </FieldLabel>
                        <Input
                            {...field}
                            placeholder="Please enter username"
                        />
                    </Field>
                )}
                />
                <Controller
                name="password"
                control={form.control}
                render={({ field }) => (
                    <Field>
                        <FieldLabel>
                            Password
                        </FieldLabel>
                        <Input
                            {...field}
                            placeholder="Please enter username"
                            type='password'
                        />
                    </Field>
                )}
                />
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (<><Loader2 className='mr-2 w-4 h-4 animate-spin'/> Please Wait</>) : ("SignUp")}
                </Button>
            </form>
            <div className='text-center mt-4'>
                <p>
                    Already a member?{' '}
                    <Link href="/sign-in" className='text-blue-600 hover:text-blue-800'>Sign In</Link>
                </p>
            </div>
        </div>
    </div>
  )
}

export default page