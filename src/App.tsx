/* import { apiFetch, setAccessToken } from './api/apiClient';
import { loginApi } from './api/authApi'; */
import './App.css'
import { ItemList } from './components/ItemList';
import { ItemsForm } from './components/ItemsForm';
import { useItems } from './hooks/useItems'
import { parseJwt } from './utils/parseJwt';
/* 
type Session = {
    deviceId: string;
    userAgent: string;
    createdAt: string;
    expiresAt: string;
    isActive: boolean;
} */

function App() {
  const {items, current, updateCurrent, 
    add, update, remove, pending, error} = useItems();
  /* loginApi("user@mail.com", "123456").then(res => {
    if(res) {
      setAccessToken(res.accessToken)
    }
  });
  const res = apiFetch<Session[]>("/auth/sessions").then(res => res);
  
  console.log(res); */
  console.log(parseJwt("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxMzg0NmVmOS1iZmRjLTQ4ZWUtYmQ5MS00ODU1ZGEzMmFmNWYiLCJyb2xlIjoidXNlciIsImVtYWlsIjoidXNlckBtYWlsLmNvbSIsIm5iZiI6MTc3MTU4NjgyNiwiZXhwIjoxNzcxNTg3NzI2LCJpYXQiOjE3NzE1ODY4MjZ9.TE3vqGsxXIT5dPk9-RKzdHoD4sj4vRg59okI5ntw-hA"));

  return (
    <>
      <ItemsForm add={add} update={update} current={current} setCurrent={updateCurrent} pending={pending} errorApi={error} />
      <ItemList items={items} setCurrent={updateCurrent} remove={remove} pending={pending} error={error} />
    </>
  )
}

export default App