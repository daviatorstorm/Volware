import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import './App.scss';

import Dashboard from './pags/Dashboard/Dashboard';
import ScanQR from './pags/ScanQR';
import ShowQR from './pags/ShowQR';
import UserQR from './pags/UserQR';
import UserAdd from './pags/Users/UserAdd';
import UserProfilePhoto from './pags/Users/UserProfilePhoto';
import UserDocumentPhoto from './pags/Users/UserDocumentPhoto';
import UserPreview from './pags/Users/UserPreview';
import Users from "./pags/Users/Users/Users";
import Warehouse from './pags/Warehouse/Warehouse';
import AddWarehouseItem from './pags/Warehouse/AddWarehouseItem';
import Order from './pags/Orders/Order';
import OrderList from './pags/Orders/OrderList';
import ActionsLog from './pags/ActionLog/ActionsLog';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route exact path='/' element={<Dashboard />} />

				<Route path='/users' element={<Users />} />
				<Route exact path="/users/add" element={<UserAdd />} />
				<Route exact path="/users/add/profile-photo" element={<UserProfilePhoto />} />
				<Route exact path="/users/add/document-photo" element={<UserDocumentPhoto />} />
				<Route exact path="/users/add/preview" element={<UserPreview />} />
				<Route exact path="/users/:id" element={<UserPreview />} />

				<Route path='/warehouse' element={<Warehouse />} />
				<Route path='/warehouse/addItem' element={<AddWarehouseItem />} />
				<Route path='/warehouse/:id' element={<AddWarehouseItem />} />

				<Route path='/orders' element={<OrderList />} />
				<Route path='/order/:id' element={<Order />} />

				<Route path='/actions' element={<ActionsLog />} />

				<Route path='/scanqr' element={<ScanQR />} />
				<Route path='/showqr' element={<ShowQR />} />
				<Route path='/userqr/:qr' element={<UserQR />} />
			</Routes>

		</BrowserRouter>
	);
}

export default App;
