import { useEffect, useRef, useState } from 'react';
import Calls from './Calls';
import {Main} from './Main';

export const Table = (props) => {

  const [showDisplay, setShowDisplay] = useState(false);
  const [title, setTitle] = useState('');
  const [qty, setQty] = useState('');


  useEffect(() => {
      Calls.getShoppingListAll()
  }, [props.data]);

  const showDialog = () => { setShowDisplay(true); }
  const closeDialog = () => { setShowDisplay(false); }

  const editOne = () => {
    if(typeof window != "undefined") {
       window.location.reload();
       //alert("Item will be changed")
    }
  }

  return(
    <div className='wrap_table'>

        <div className='each_item'>
            <p className='each_info_p'>{props.data.content}: {props.data.count}</p>
            <button onClick={showDialog} style={{ marginTop: '20px' }} className='com_change'>Change Info</button>
            <button className='com_change' onClick={() => {
              Calls.updateShoppingItem(props.data.id, { content: props.data.content, state: props.data.state == 'active' ? 'completed' : 'active', count: props.data.count })
              setTimeout(() => {editOne()}, 1000)
            }}
              style={{ marginTop: '20px' }}>{props.data.state == 'active' ? 'completed' : 'active'}</button>
              <div style={{ display: showDisplay ? 'grid' : ' none' }}>
                  <button onClick={closeDialog} className='cls_btn'>Close</button>
                  <input type='text' placeholder={props.data.content} className='com_inp' onChange={(e) => { setTitle(e.target.value) }}/>
                  <input type='text' placeholder={props.data.count} className='com_inp' onChange={(e) => { setQty(e.target.value) }}/>
                  <button className='edit_btn' onClick={(e) => {
                    if(title.length > 0 && qty.length > 0) {
                      Calls.updateShoppingItem(props.data.id, { content: title, state: props.data.state, count: parseInt(qty) });
                      closeDialog();
                      setTimeout(() => {editOne()}, 1000)
                    }
                    else alert("Fields shouldn't be empty");
                  }}>Edit</button>
              </div>

            <div className='delete_btn' onClick={() => {
              Calls.deleteShoppingItem(props.data.id);
              editOne();
            }}>+</div>
        </div>

    </div>
  )
}
