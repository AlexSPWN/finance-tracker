
import './App.css'
import { AppRouter } from './router/AppRouter'
/* import { ItemList } from './components/ItemList';
import { ItemsForm } from './components/ItemsForm';
import { useItems } from './hooks/useItems' */

function App() {
  /* const {items, current, updateCurrent, 
    add, update, remove, pending, error} = useItems(); */

  return (
    <>
    <AppRouter />
      {/* <ItemsForm add={add} update={update} current={current} setCurrent={updateCurrent} pending={pending} errorApi={error} />
      <ItemList items={items} setCurrent={updateCurrent} remove={remove} pending={pending} error={error} /> */}
    </>
  )
}

export default App