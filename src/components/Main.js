import { useEffect, useRef, useState } from 'react';
import { Table } from './Table';
import Calls from './Calls';
import search from '../bx_search.svg';

export const Main = () => {

  const [newValue, setNewValue] = useState('');
  const [filterItem, setFilterItem] = useState('');
  const [data, setData] = useState([]);
  const [aimItem, setAimItem] = useState('');

  const fetchData = async() => {
      Calls.getShoppingListAll()
      .then((res) => setData(res))
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    fetchData()
  }, [])

  const addItem = async() => {
      Calls.createShoppingItem({ content: newValue, state: "active", count: 1,})
      .then(fetchData())
      .then(res => res.json())
      .catch(err => console.log(err))
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

  return(
    <div className='wrap_main'>
        <div className='wrap_inputs'>
              <input type='text' placeholder='choose product' className='inp1' value={newValue} onChange={(e) => {
                setNewValue(e.target.value);
              }}/>
            <button type='submit' onClick={addItem} id='add_btn'>Add</button>
        </div>
        <div className='wrap_each_item'>
        {
          data.map(item => (
            <div>
              <Table data={item} />
            </div>
          ))
        }
        </div>
        <div className='wrap_search'>
            <input type='text' className='inp2' onChange={(e) => { setAimItem(e.target.value);} } placeholder='Find your stuff' />
            <img src={search} id='search_loop' onClick={filtrOfItems}/>
        </div>
        <div onClick={getOnlyCompleted} className='eachFiltr'>Get only completed</div>
        <div onClick={getOnlyActive} className='eachFiltr'>Get only active</div>
        <div className='eachFiltr' onClick={fetchData}>Reset filtr</div>
        <div className='eachFiltr' onClick={sortByMax}>Sort by qty (from max)</div>
        <div className='eachFiltr' onClick={sortByMin}>Sort by qty (from min)</div>
    </div>
  )
}
