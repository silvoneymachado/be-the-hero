import React, {useState, useEffect} from 'react'
import { FiPower, FiTrash2 } from "react-icons/fi"
import { Link, useHistory } from 'react-router-dom'

import './styles.css'
import logoImg from '../../assets/logo.svg'
import api from '../../services/api'

export default function Profile(){
  const [incidents, setIncidents] = useState([])
  
  const ongName = localStorage.getItem('ongName')
  const ongId = localStorage.getItem('ongId')
  const history = useHistory()
  const headers =  {headers: {Authorization: ongId}}

  useEffect(() => {
    api.get('profile', headers).then(response => {
      setIncidents(response.data) 
    })
  }, [ongId])

  if(!ongName) toLoginPage()

  function onClickLogout(){
    localStorage.clear()
    toLoginPage()
  }

  function toLoginPage(){
    history.push('/')
  }

  function onClickDelete(id){
    try {
      api.delete(`incidents/${id}`, headers).then(() => {
        setIncidents(incidents.filter(incident => incident.id !== id))
      })
    } catch (err) {
      alert('Erro o deletar caso, tente novamente.')
    }
  }

  return (
    <div className="profile-container">
      <header>
        <img src={logoImg} alt="Be The Hero"/ >
          <span>Bem vinda {ongName}</span>

          <Link className="button" to="/incidents/new">
              Cadastrar novo caso
          </Link>
          <button onClick={onClickLogout} type='button'>
            <FiPower size={18} color="#E02041"/>
          </button>
      </header>

      <h1>Casos cadastrados</h1>
      <ul>
          {incidents.map(incident => (
            <li key={incident.id}>
              <strong>CASO:</strong>
              <p>{incident.title}</p>
    
              <strong>DESCRIÇÃO:</strong>
              <p>{incident.description}</p>
    
              <strong>VALOR:</strong>
              <p>{Intl.NumberFormat('pt', {style: 'currency', currency: 'BRL'}).format(incident.value)}</p>
    
              <button onClick={() => onClickDelete(incident.id)} type='button'>
                <FiTrash2 size={20} color="#a8a8b3"/>
              </button>
            </li>
          ))}
      </ul>
    </div>
  )
}