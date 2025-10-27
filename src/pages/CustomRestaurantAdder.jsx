import React, { useState } from 'react'

function CustomRestaurantAdder() {
    const[restaurant,setRestaurant]=useState(
    {
        restaurantName:"",
        restaurantProfile:"",
        cuisineType:"",
        restaurantAddress:"",
        rating:0,
        openOrClosed:"",
        menuList:[{
            menuName:"",
            menuProfile:"",
            rating:0,
            description:"",
            price:0,
        }]

    });
    const[file,setFile]=useState(null);
    const[preview,setPreview]=useState(null);


    const handleOnChange=(e)=>{

        const selectedFile=e.target.files[0];
        setFile(selectedFile);
        console.log("selectedFile", selectedFile)
        restaurant.restaurantProfile=selectedFile;
        if(selectedFile){
            setPreview(URL.createObjectURL(selectedFile));
        }
    };
  return (
    <div className='border-[1px] p-3 flex justify-start w-[300px]'>
       <input type='file' accept='image/*' onChange={handleOnChange}/>
        {preview && <img src={preview} alt='preiview'/>}
    </div>
  )
}

export default CustomRestaurantAdder