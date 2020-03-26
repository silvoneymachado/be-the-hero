import React, { useState }from "react"
import { FiLogIn } from "react-icons/fi"
import { Link, useHistory } from 'react-router-dom'

import api from'../../services/api'
import { allFiledsFilled } from '../../util/commonFunctions'

import './styles.css'
import heroesImg from '../../assets/heroes.png'
import logoImg from '../../assets/logo.svg'

export default function Logon(){
  const [id, setId] = useState('')

  const ongName = localStorage.getItem('ongName')
  const history = useHistory()

  if(!!ongName) history.push('/profile')

  async function handleLogin(e){
    e.preventDefault()
    const data = { id }

    if(allFiledsFilled(data)) {
      alert('Você precisa preencher o campo "Sua ID"')
    } else {
      try {
        const response = await api.post('sessions', data)

        localStorage.setItem('ongName', response.data.name)
        localStorage.setItem('ongId', id)

        history.push('/profile')
      } catch (err) {
        alert('Erro ao efetuar login, tente novamente')
      }
    }

    
  }

  return(
      <div className="logon-container">
        <section className="form">
          <img src={logoImg} alt="Be The Hero"/>

          <form onSubmit={handleLogin}>
            <h1>Faça seu logon</h1>

            <input
              minLength="3"
              placeholder='Sua ID'
              value={id}
              onChange={e => setId(e.target.value)}
            />
            <button className="button" type='submit'>Entrar</button>

            <Link className="back-link" to="/register">
              <FiLogIn size={16} color="#E02041"/>
              Não tenho cadastro
            </Link>
          </form>
        </section>

        <img src={heroesImg} alt="hereos"/>
      </div>
  )
}