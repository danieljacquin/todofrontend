import  DashBoardRoutes from './routers/DashBoardRoutes';
import { BrowserRouter as Router } from 'react-router-dom';

const App = () => {
  return(
    <>
      <Router>
        <DashBoardRoutes/>
      </Router> 
    </>
  )
}


export default App;
