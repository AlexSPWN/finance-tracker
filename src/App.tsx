
import './App.css'
import { Header } from './components/common/Header'
import { AppRouter } from './router/AppRouter'

function App() {

  return (
    <>
    <Header />
    <div className="pt-3">
      <AppRouter />
    </div>
    </>
  )
}

export default App