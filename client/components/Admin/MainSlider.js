import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BiTrash } from 'react-icons/bi';

const MainSlider = ({ tab }) => {
    const [ slides, setSlides ] = useState([]);
    const [ slide, setSlide ] = useState('');
    const [ file, setFile ] = useState(null);
    const [ order, setOrder ] = useState(0);

    useEffect(() => {
        axios.get(`${process.env.API_URL}/slides`).then((res) => {
            setSlides(res.data);
        });
    }, [ tab ]);

    const handleSubmit = (e) => {
        e.preventDefault();

        var formData = new FormData();
        formData.append('file', file);
        formData.append('order', order);

        axios.post(`${process.env.API_URL}/slides`, formData).then((res) => {
            console.log(res);
            // setFile(null)
        })
    }

    const deleteSlide = (slide_id) => {
        if (prompt("הזן סיסמא") == '123123') {
            axios.delete(`${process.env.API_URL}/slides/${ slide_id }`).then(res => {
                console.log(res)
                setSlides(slides.filter((dis) => dis._id !== slide_id))
            });
        }
    }
    
    return (
        <div>
            <form action="" id="new-discount-form" onSubmit={ (e) => handleSubmit(e) }>
                <h3>הוסף סליידר חדש</h3>
                <div>
                    <input type="number" placeholder="סדר" value={ order } onChange={ (e) => setOrder(e.target.value) }/>
                </div>

                <div>
                    <input type="file" onChange={ (e) => setFile(e.target.files[0]) } accept ="image/*"/>
                </div>

                <div>
                    <input type="submit" value="הוסף" />
                </div>
            </form>

            <div id="cities-list">
                { slides.map(item => (
                    <div className="discount-list-item">
                        <div className="discount-delete-btn" onClick={ () => deleteSlide(item._id) }><BiTrash/></div>

                        <div><strong>קישור:</strong> <a href={`${ item.url }`}>תמונה</a></div>
                        <div><strong>סדר:</strong> { item.order }</div>
                    </div>
                )) }
            </div>
        </div>
    )
}

export default MainSlider