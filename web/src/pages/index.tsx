import Image from "next/image"

import appPreviewImg from '../assets/app-nlw-copa-preview.png'
import logoImg from '../assets/logo.svg'
import usersAvatarExampleImg from '../assets/users-avatar-example.png'
import iconCheckImg from '../assets/icon-check.svg'
import { api } from "../lib/axios"
import { FormEvent, useState } from "react"

interface HomeProps {
  pollCount: number
  guessCount: number
  userCount: number
}

export default function Home({ pollCount, guessCount, userCount }: HomeProps) {
  const [pollTitle, setPollTitle] = useState('')

  async function handleCreatePoll(event: FormEvent) {
    event.preventDefault()

    try {
      const response = await api.post('/polls', {
        title: pollTitle,
      })

      const { code } = response.data

      await navigator.clipboard.writeText(code)

      alert(`Pool created successfully, your code is: ${code} and has been copied to your clipboard.`)
      
      setPollTitle('')
    } catch (err) {
      console.log(err)
      alert('Could not create pool, try again.')
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImg} alt="NLW Copa logo" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">Have fun with your friends! Guess game results for FIFAs 2022 World Cup™️</h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExampleImg} alt="" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{userCount}</span> users already joined
          </strong>
        </div>

        <form onSubmit={handleCreatePoll} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100" 
            type="text" 
            required 
            placeholder="Name your poll"
            onChange={event => setPollTitle(event.target.value)}
            value={pollTitle}
          />
          <button className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700">Create your poll</button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">After creating your poll you will receive an unique code that you can use to invite other people! 🚀</p>
        
        <div className="mt-10 pt-10 border-t border-gray-600 divide-x divide-gray-600 grid grid-cols-2 text-gray-100">
          <div className="flex gap-6 items-center">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{pollCount}</span>
              <span>Polls created</span>
            </div>
          </div>

          <div className="flex gap-6 justify-end items-center">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{guessCount}</span>
              <span>Guesses sent</span>
            </div>
          </div>
        </div>
      </main>

      <Image 
        src={appPreviewImg} 
        alt="Two smartphones showing a preview of NLW Copa mobile app" 
        quality={100}
      />
    </div>
  )
}

export const getStaticProps = async () => {
  const [
    pollCountResponse, 
    guessCountResponse, 
    userCountResponse
  ] = await Promise.all([
    api.get('polls/count'),
    api.get('guesses/count'),
    api.get('users/count')
  ])

  return {
    props: {
      pollCount: pollCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
    revalidate: 60 * 10 // 10 minutes
  }
}
