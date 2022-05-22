import Dashboard from './pages/dashboard'
import Login from './pages/login'
import Outlet from './pages/outlet'
import Admin from './pages/admin'
import Profile from './pages/profile'
import Customer from './pages/customer'
import Paket from './pages/paket'
import SelectCustomer from './pages/selectCustomer'
import SelectLaundry from './pages/selectLaundry'
import Cart from './pages/cart'
import FormTransaksi from './pages/formTransaksi'
import Transaksi from './pages/transaksi'
import DetailTransaksi from './pages/detailTransaksi'
import CetakTransaksi from './pages/cetakTransaksi'
import Laporan from './pages/laporan'
import PrintLaporan from './pages/printLaporan'
import { Route, Switch } from 'react-router-dom'

function App() {
  return (
    <Switch>
      <Route exact path="/" component={Dashboard} />
      <Route path="/login" component={Login} />
      <Route path="/outlet" component={Outlet} />
      <Route path="/admin" component={Admin} />
      <Route path="/profile" component={Profile} />
      <Route path="/customer" component={Customer} />
      <Route path="/paket" component={Paket} />
      <Route path="/selectCustomer" component={SelectCustomer} />
      <Route path="/selectLaundry" component={SelectLaundry} />
      <Route path="/cart" component={Cart} />
      <Route path="/formTransaksi" component={FormTransaksi} />
      <Route path="/transaksi" component={Transaksi} />
      <Route path="/detailTransaksi" component={DetailTransaksi} />
      <Route path="/cetakTransaksi" component={CetakTransaksi} />
      <Route path="/laporan" component={Laporan} />
      <Route path="/printLaporan" component={PrintLaporan} />
    </Switch>
  );
}

export default App;