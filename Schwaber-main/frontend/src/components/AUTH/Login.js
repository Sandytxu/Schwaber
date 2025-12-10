import React, { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { login } from '../../services/services';
import { Messages } from 'primereact/messages';



const { REACT_APP_BACKEND } = process.env;

function Login({ redirect = true }) {
  const messages = useRef(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login(username, password);
      if (res === 'ok') {
        if (redirect) {
          window.location.href = '/';
        }
      }
    }
    catch (error) {
      console.log(error);
      messages.current.show({ severity: 'error', summary: 'Error', detail: error.response?.data });
    }


    setTimeout(() => {
      setLoading(false);

    }, 2000);
  };

  // Header del Card 
  const header = (
    <div style={{ height: '10px', background: 'var(--primary-color)' }}></div>
  );

  return (
    <div className="login-container">
      <Card
        title="Bienvenido"
        subTitle="Ingresa tus credenciales para continuar"
        style={{ width: '400px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
        header={header}
        className="p-fluid" // Hace que los inputs ocupen el 100% del ancho
      >
        <form onSubmit={handleSubmit}>

          {/* Campo Usuario */}
          <div className="p-field" style={{ marginTop: '2em' }}>
            <span className="p-float-label">
              <InputText
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
              <label htmlFor="username">Usuario / Email</label>
            </span>
          </div>

          {/* Campo Contraseña */}
          <div className="p-field" style={{ marginTop: '2em' }}>
            <span className="p-float-label">
              <Password
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                feedback={false} // Oculta la barra de fortaleza para login
                toggleMask // Muestra el icono de "ojo" para ver contraseña
              />
              <label htmlFor="password">Contraseña</label>
            </span>
          </div>

          <Divider />

          {/* Botón de envío */}
          <Button
            label="Iniciar Sesión"
            icon="pi pi-user"
            loading={loading}
            type="submit"
            style={{ marginTop: '1em' }}
          />
        </form>
        <Messages ref={messages} />
      </Card>

      <style jsx>{`
                .login-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background-color: #F0F8FF; 
                }
            `}</style>
    </div>
  );
}

export default Login;