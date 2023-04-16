import { useEffect, useRef, useState } from 'react';
import { Table } from './Table';
import Calls from './Calls';
import search from '../bx_search.svg';
import * as React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

export const Main = () => {

  const DEFAULT_QUANTITY = 1;
  const [newValue, setNewValue] = useState('');
  const [filterItem, setFilterItem] = useState('');
  const [data, setData] = useState([]);
  const [aimItem, setAimItem] = useState('');

  const fetchData = async() => {
      setAimItem('');
      Calls.getShoppingListAll()
      .then((res) => setData(res))
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    fetchData();
   }, []);

  const addItem = async() => {
      Calls.createShoppingItem({ "content": newValue, "state": "ACTIVE", "count": DEFAULT_QUANTITY})
      .then(fetchData())
      .then(res => res.json())
      .catch(err => console.log(err))
      if(typeof window != "undefined")  window.location.reload();
  }

  const getOnlyCompleted = () => {
    Calls.getShoppingListOnlyCompleted()
    .then((res) => setData(res))
    .then(res => res.json())
    .catch(err => console.log(err))
  }

  const getOnlyActive = () => {
    Calls.getShoppingListOnlyActive()
    .then((res) => setData(res))
    .then(res => res.json())
    .catch(err => console.log(err))
  }

      const filtrOfItems = () => {
        let arr = data.filter((item) => {
          return item.content.toUpperCase().indexOf(aimItem.toUpperCase()) !== -1;
        });
        setData(arr);
      }
    const filtrByOne = () => {
    Calls.getFilteredItem(aimItem)
        .then((res) => setData(res))
        .then(res => res.json())
        .catch(err => console.log(err))
    }

  const sortByMax = () => {
    let arr = data.sort((a, b) => { return b.count - a.count });
    setData(arr);
    filtrOfItems();
  }
  const sortByMin = () => {
    let arr = data.sort((a, b) => { return a.count - b.count });
    setData(arr);
    filtrOfItems();
  }

  const basicAlerts = () => {
        return (
            <Stack sx={{ width: '100%', margin: '30px 0px' }} spacing={2}>
                <Alert variant="filled" severity="warning">
                    No products was found, please, Reset Filter and check your list again!
                </Alert>
            </Stack>
        );
    }

  const existingData = () => {
      return(
          <div className='wrap_each_item'>
              {
                  data.map(item => (
                      <div>
                          <Table data={item} />
                      </div>
                  ))
              }
          </div>
      )
  }

  const retrieveData = () => {
      return(
          <div>
              { data.length > 0 ? existingData() : basicAlerts() }
          </div>
      )
  }

  return(
    <div className='wrap_main'>
        <div className='wrap_inputs'>
              <input type='text' placeholder='choose product' className='inp1' value={newValue} onChange={(e) => {
                setNewValue(e.target.value);
              }}/>
            <button type='submit' onClick={addItem} id='add_btn'>Add</button>
        </div>
        {retrieveData()}
        <div className='wrap_search'>
            <input type='text' className='inp2' onChange={(e) => { setAimItem(e.target.value);} } placeholder='Find your stuff' />
            <img src={search} id='search_loop' onClick={filtrByOne}/>
        </div>
        <div onClick={getOnlyCompleted} className='eachFiltr'>Get only completed</div>
        <div onClick={getOnlyActive} className='eachFiltr'>Get only active</div>
        <div className='eachFiltr' onClick={fetchData}>Reset filtr</div>
        <div className='eachFiltr' onClick={sortByMax}>Sort by qty (from max)</div>
        <div className='eachFiltr' onClick={sortByMin}>Sort by qty (from min)</div>
    </div>
  )
}
