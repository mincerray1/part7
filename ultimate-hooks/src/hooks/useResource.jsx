import axios from 'axios'
import { useEffect, useState } from 'react'
// const baseUrl = '/api/notes'

// let token = null

// const setToken = newToken => {
//   token = `bearer ${newToken}`
// }

export const useResource = (baseUrl) => {
    const [resource, setResource] = useState([])

    useEffect(()=> {
			if (baseUrl) {
				axios.get(baseUrl).then(response=>{
					setResource(response)
				})
				.catch(error=>{
					console.log(error)
					setResource(null)
				})

			} else {
				setResource(null)
			}
    }, [baseUrl])

    const create = async newObject => {
      const config = {
        headers: { Authorization: token },
      }
    
      const response = await axios.post(baseUrl, newObject, config)
			setResource([...resource, response.data])
      return response.data
    }

    const update = async (id, newObject) => {
			const response = await axios.put(`${ baseUrl }/${id}`, newObject)
			setResource(resource.map(item=>{
				if (item.id === id) {
					return newObject
				} else {
					return {...item}
				}
			}))
			return response.data
    }

		const resourceService = {
			create, update
		}

    return [resource, resourceService]
}