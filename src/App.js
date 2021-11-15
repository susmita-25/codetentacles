import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import './App.css';
import { TextField } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function App() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [value, setValue] = React.useState(0);
  const [resultList,setResultList] = React.useState([]);
  const [artistForm, setArtistForm] = React.useState({
    name:"",
    noOfTrack:""
  });
  const [isFormInvalid, setIsFormInvalid] = React.useState(false);
  const [isResponse,setIsResponse] = React.useState(false);
  const [artistInfo,setArtistInfo] = React.useState({})
  
  const searchArtist = () => {
    if(artistForm.name.toLowerCase()==='jack' && artistForm.noOfTrack==='4'){
      setIsFormInvalid(false);
      const req = `http://itunes.apple.com/search?term=${artistForm.name}&limit=${artistForm.noOfTrack}`
      fetch(req)
      .then(res => res.json())
      .then(
        (result) =>{
          console.log(result)
          setIsResponse(true);
          setResultList(result.results)
          handleClose()
        }
      )
    }else{
      setIsFormInvalid(true);
    }
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    const req = `http://itunes.apple.com/search?term=${resultList[newValue].artistName}&limit=1`
    fetch(req)
    .then(res => res.json())
    .then(
      (result) =>{
        console.log(result)
        setArtistInfo([])
        setArtistInfo(result.results[0])
      }
    )
  };

  const updateValues = (e,field) => {
    try{
      switch(field){
          case 'name':
              artistForm.name = e.target.value;
              break;
        default:
            artistForm.noOfTrack = e.target.value
            break;
      }
  }catch(e){
      console.log(e)
  }
  }

  return (
    <div className="App">
     { !isResponse && <Button size="medium" style={{margin:'300px'}} variant="contained" onClick={handleOpen}>Search Artist</Button>}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {/* <Typography id="modal-modal-title" variant="h6" component="h2">
            Name
          </Typography> */}
          <TextField
          error={isFormInvalid}
          style={{width:'100%'}}
          id="standard-error-helper-text"
          label="Name"
          name="name"
          defaultValue={artistForm.name}
          onChange={(e)=>updateValues(e,'name')}
          // defaultValue=""
          helperText={isFormInvalid && "Incorrect entry."}
          variant="standard"
        />
        <br />
          {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            No of Tracks
          </Typography> */}
          <TextField
          error={isFormInvalid}
          style={{width:'100%'}}
          id="standard-error-helper-text"
          label="No of Tracks"
          defaultValue={artistForm.noOfTrack}
          helperText={isFormInvalid && "Incorrect entry."}
          variant="standard"
          onChange={(e)=>updateValues(e,'trackNo')}
        />
        <br />
        <br />
        <br />
        <Button style={{width:'100%'}} size="medium" variant="contained" onClick={searchArtist}>Search</Button>
        </Box>
      </Modal>
      {isResponse && <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
        {resultList.map((item,index)=>{
        return(
          <Tab key={index} label={item.artistName}  />
        )
        })}
          
        </Tabs>
      </Box>
      {artistInfo && 
        
          <TabPanel value={value} index={value}>
        {artistInfo.artistName}<br/>
        {artistInfo.trackName}<br/>
        <img alt="" src={artistInfo.artworkUrl30 ? artistInfo.artworkUrl30 :artistInfo.artworkUrl60}/><br/>
      </TabPanel>
        
        }
      
    </Box>}
    </div>
  );
}

export default App;
