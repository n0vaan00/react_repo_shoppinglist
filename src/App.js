import {useState, useEffect} from 'react';
import './App.css';
import axios from 'axios';

const URL = 'http://localhost/shoppinglist/';


function App() {

  const [items, setItems] = useState([]);
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');

  function save(e) {
    e.preventDefault();
    const json = JSON.stringify({description:product, amount:amount})
    axios.post(URL + 'add.php',json,{
      headers:{
        'Content-Type' : 'application/json'
      }
    })
      .then((response) => {
        setItems(items => [...items,response.data]);
        setProduct('');
        setAmount('');
      }).catch (error => {
        alert(error.response.data.error)
      });
  }

  function remove(id) {
    const json = JSON.stringify({id:id})
    axios.post(URL + 'delete.php', json, {
      headers: {
        'Content-Type' : 'application/json'
      }
    })
      .then((response) => {
        const newListWithoutRemoved = items.filter((item) => item.id !== id);
        setItems(newListWithoutRemoved);
      }).catch (error => {
        alert(error.response ? error.response.data.error : error);
      });
  }

  useEffect(() => {
    axios.get(URL)
      .then((response) => {
        setItems(response.data);
      }).catch(error => {
        alert(error);
      });
  }, [])

  return (
    <div className="container">
      <h3>Shopping list</h3>
      <form onSubmit={save}>
        <label>New item</label>
        <input value={product} onChange={e => setProduct(e.target.value)} placeholder="type product"/>
        <label>Amount</label>
        <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="type amount"/>
        <button>Add</button>
      </form>
      <ol>
        {items?.map(product =>(
          <li key={product.id}>
            {product.description},  Amount: {product.amount}&nbsp;
            <a href="#" className="delete" onClick={() => remove(product.id)}>
              Delete
            </a>
            </li>
        ))}
      </ol>
    </div>
  );
}

export default App;
