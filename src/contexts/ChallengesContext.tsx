import { createContext, ReactNode, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import challenges from '../../challenges.json'
import { LevelUpModal } from '../components/LevelUpModal'

interface ChallengesProviderProps {
    children: ReactNode;
    level: number
    currentXp: number
    challengesCompleted: number

}

interface Challenge {
    type: 'body' | 'eye'
    description: string
    amount: number
}

interface ChalengesContextData {
    level: number
    currentXp: number
    challengesCompleted: number
    activeChallenge: Challenge
    experienceToNextLevel: number
    startNewChallenge: () => void
    LevelUp: () => void
    resetChallenge: () => void
    completeChallenge: () => void
    closeLevelUpModal: () => void
}

export const ChalengesContext = createContext({} as ChalengesContextData)

export function ChallengesProvider({ children, ...rest }: ChallengesProviderProps) {
    const [level, setLevel] = useState(rest.level ?? 1)
    const [currentXp, setCurrentXp] = useState(rest.currentXp ?? 0)
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0)

    const [activeChallenge, setActiveChallenge] = useState(null)
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false)

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2)

    useEffect(() => {
        Notification.requestPermission()
    }, [])

    useEffect(() => {
        Cookies.set('level', String(level))
        Cookies.set('currentXp', String(currentXp))
        Cookies.set('challengesCompleted', String(challengesCompleted))
    }, [level, currentXp, challengesCompleted])

    function LevelUp() {
        setLevel(level + 1)
        setIsLevelUpModalOpen(true)
    }

    function startNewChallenge() {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengeIndex]

        setActiveChallenge(challenge)

        new Audio ('/notification.mp3').play()

        if(Notification.permission === "granted") {
            new Notification('Novo Desafio 🎉', {
                body: `Valendo ${challenge.amount}xp!`
            })
        }
    }

    function resetChallenge() {
        setActiveChallenge(null)
    }

    function closeLevelUpModal() {
        setIsLevelUpModalOpen(false)
    }

    function completeChallenge() {
        if(!activeChallenge) {
            return
        }

        const { amount } = activeChallenge

        let finalXp = currentXp + amount
        
        if (finalXp >= experienceToNextLevel) {
            finalXp = finalXp - experienceToNextLevel
            LevelUp()
        }

        setCurrentXp(finalXp)
        setActiveChallenge(null)
        setChallengesCompleted(challengesCompleted + 1)
    }

    return (
        <ChalengesContext.Provider value = {{
            experienceToNextLevel,
            level, 
            currentXp,
            challengesCompleted,
            startNewChallenge,
            LevelUp,
            activeChallenge,
            resetChallenge,
            completeChallenge,
            closeLevelUpModal
        }} >
            {children}

            {isLevelUpModalOpen && <LevelUpModal />}
        </ChalengesContext.Provider>
    )
}