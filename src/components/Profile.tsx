import { useContext } from 'react'
import { ChalengesContext } from '../contexts/ChallengesContext'
import styles from '../styles/components/Profile.module.css'

export function Profile() {
    const { level } = useContext(ChalengesContext)

    return(
        <div className = {styles.profileContainer} >
            <img src="https://github.com/sandrovisky.png" alt="Sandro"/>
            <div>
                <strong>Sandro Garcia</strong>
                
                <p>
                    <img src="icons/level.svg" alt="Level"/>
                    Level {level}
                </p>
            </div>
        </div>
    )
}