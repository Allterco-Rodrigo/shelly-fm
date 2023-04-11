import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import Overview from './Overview';
import Device from './Device/Device';
import Complex from "./Location/Complexes/Complex";
import Building from "./Location/Buildings/Building";
import Floor from "./Location/Floors/Floor";
import Unit from "./Location/Units/Unit";
import Room from "./Location/Rooms/Room";
import { Route, Routes, useNavigate } from "react-router-dom";
import ComplexAdd from './Location/Complexes/ComplexAdd';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import { 
  AnalyticsOutlined, ChangeCircle, ExpandLess,
  ExpandMore, HolidayVillage, HomeWorkOutlined,
  LanguageOutlined, LayersOutlined, MeetingRoomOutlined,
  RemoveCircle, RouterOutlined, ViewQuiltOutlined,
  ZoomInOutlined } from '@mui/icons-material';
import { Collapse, ListItemIcon } from '@mui/material';
import { refreshDevicesData, patchConnectedDevices } from '../services/device';
import DeviceAdd from './Device/DeviceAdd';
import Message from './Message';
import Test from './Test';

const drawerWidth = 220;
const copy = "Copyright© by Allterco Robotics " + new Date().getFullYear();


export default function Dashboard() {
  const navigate = useNavigate();

  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [open5, setOpen5] = useState(false);
  const [open6, setOpen6] = useState(false);


  const handleClickOverview = () => {
    navigate("/")
  };
  const handleClickComplexes = () => {
    setOpen1(!open1);
    navigate("/complex/all")
  };
  const handleClickBuildings = () => {
    setOpen2(!open2);
    navigate("/building/all")
  };
  const handleClickFloors = () => {
    setOpen3(!open3);
    navigate("/floor/all")
  };
  const handleClickUnits = () => {
    setOpen4(!open4);
    navigate("/unit/all")
  };
  const handleClickRooms = () => {
    setOpen5(!open5);
    navigate("/room/all")
  };
  const handleClickDevices = () => {
    setOpen6(!open6);
    navigate("/device/all")
  };
  const handleClickDevicesCreate = () => {
    navigate("/device/add")
  };
  // const handleClickDevicesUpdate = () => {
  //   navigate("/device/upd")
  // };
  // const handleClickDevicesDelete = () => {
  //   navigate("/device/del")
  // };

  // Refresh data from already connected devices
  async function refreshData() {
    // console.log("Refreshing data of connected devices...")
   const ret = refreshDevicesData()
      .then((success)=>{
        if(success){
          navigate("/loadingpage/t10")
        }
        else {
          // console.log("Refresh failed") 
          navigate("/")
        }
      })
  };

  // Refresh list of connected devices and their data
  async function reloadDevices () {
    // console.log("Refreshing list of connected devices...")
    const ret = patchConnectedDevices()
    .then(()=>{
      navigate("/loadingpage/t90")
    })
  };


  return (
    <>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* HEADER */}
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Shelly - Device Control Center
          </Typography>
        </Toolbar>
      </AppBar>
      {/* SIDER */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        {/* overview */}
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          component="nav"
        >
          <ListItemButton onClick={handleClickOverview}>
            <ListItemIcon>
              <LanguageOutlined />
            </ListItemIcon>
            <ListItemText primary="Overview" />
          </ListItemButton>  
        </List>      
        {/* complexes */}
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <ListItemButton onClick={handleClickComplexes}>
            <ListItemIcon>
              <HolidayVillage />
            </ListItemIcon>
            <ListItemText primary="Complexes" />
            {open1 ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open1} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }} onClick={()=>{navigate('/complex/add')}}>
                <ListItemIcon>
                  <AddCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Create" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} onClick={()=>{navigate('/complex/upd')}}>
                <ListItemIcon>
                  <ChangeCircle />
                </ListItemIcon>
                <ListItemText primary="Update" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} onClick={()=>{navigate('/complex/del')}}>
                <ListItemIcon>
                  <RemoveCircle />
                </ListItemIcon>
                <ListItemText primary="Delete" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
        {/* buildings */}
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <ListItemButton onClick={handleClickBuildings}>
            <ListItemIcon>
              <HomeWorkOutlined />
            </ListItemIcon>
            <ListItemText primary="Buildings" />
            {open2 ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open2} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <AddCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Create" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <ChangeCircle />
                </ListItemIcon>
                <ListItemText primary="Update" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <RemoveCircle />
                </ListItemIcon>
                <ListItemText primary="Delete" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
        {/* floors */}
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <ListItemButton onClick={handleClickFloors}>
            <ListItemIcon>
              <LayersOutlined />
            </ListItemIcon>
            <ListItemText primary="Floors" />
            {open3 ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open3} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <AddCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Create" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <ChangeCircle />
                </ListItemIcon>
                <ListItemText primary="Update" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <RemoveCircle />
                </ListItemIcon>
                <ListItemText primary="Delete" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
        {/* units */}
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <ListItemButton onClick={handleClickUnits}>
            <ListItemIcon>
              <MeetingRoomOutlined />
            </ListItemIcon>
            <ListItemText primary="Units" />
            {open4 ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open4} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <AddCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Create" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <ChangeCircle />
                </ListItemIcon>
                <ListItemText primary="Update" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <RemoveCircle />
                </ListItemIcon>
                <ListItemText primary="Delete" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
        {/* rooms */}
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <ListItemButton onClick={handleClickRooms}>
            <ListItemIcon>
              <ViewQuiltOutlined />
            </ListItemIcon>
            <ListItemText primary="Rooms" />
            {open5 ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open5} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <AddCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Create" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <ChangeCircle />
                </ListItemIcon>
                <ListItemText primary="Update" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <RemoveCircle />
                </ListItemIcon>
                <ListItemText primary="Delete" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
        {/* devices */}
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <ListItemButton onClick={handleClickDevices}>
            <ListItemIcon>
              <RouterOutlined />
            </ListItemIcon>
            <ListItemText primary="Devices" />
            {open6 ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open6} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }} onClick={handleClickDevicesCreate}>
                <ListItemIcon>
                  <AddCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Create" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <ChangeCircle />
                </ListItemIcon>
                <ListItemText primary="Update" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <RemoveCircle />
                </ListItemIcon>
                <ListItemText primary="Delete" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} onClick={reloadDevices}>
                <ListItemIcon>
                  <ZoomInOutlined />
                </ListItemIcon>
                <ListItemText primary="Search Network & add devices" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}  onClick={refreshData}>
                <ListItemIcon>
                  <AnalyticsOutlined />
                </ListItemIcon>
                <ListItemText primary="Refresh Data" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>

      </Drawer>
      {/* FOOTER */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        <Routes>
            <Route path="/" element={<Overview />} />

            <Route path="/complex/all" element={<Complex />} />
            <Route path="/complex/add" element={<ComplexAdd />} />
            <Route path="/building/all" element={<Building />} />
            <Route path="/floor/all" element={<Floor />} />
            <Route path="/unit/all" element={<Unit />} />
            <Route path="/room/all" element={<Room />} />
            <Route path="/device/all" element={<Device />} />
            <Route path="/device/add" element={<DeviceAdd />} />
            <Route path="/loadingpage/t10" element={<Message text="Loading data" delay="10" />} />
            <Route path="/loadingpage/t90" element={<Message text="Scanning Network" delay="90" />} />
            <Route path="/test" element={<Test />} />

        </Routes>

        {/* <BottomNavigation> */}
            <Toolbar>
            <Typography variant="h8" noWrap component="div">
            <a href="https://shopusa.shelly.cloud/">{copy}</a>
            </Typography>
            </Toolbar>
        {/* </BottomNavigation> */}
      </Box>
    </Box>
    </>
  );
}