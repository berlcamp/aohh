'use client'
import React, { useEffect, useState } from 'react'
import Loading from '@/components/Loading'
import axios from 'axios'

interface SpType {
  id: string
  new: string
  name: string
  barangay: string
}

interface NamesType {
  id: string
  fullname: string
  address: string
  precinct: string
  service_provider: SpType
}

function List() {
  const [loading, setLoading] = useState(false)
  const [filterName, setFilterName] = useState('')
  const [data, setData] = useState<NamesType[] | []>([])

  const apiUrl = process.env.NEXT_PUBLIC_AO_API_URL ?? ''

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    handleSearch()
  }
  const handleSearch = async () => {
    if (filterName.trim() === '') return
    setLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_AO_API_URL ?? ''

      const params = {
        filterKeyword: filterName,
        take: 10,
        skip: 0
      }

      await axios.get(`${apiUrl}/aorv/search`, { params })
        .then(response => {
          if (Number(response.data.total_results) > 0) {
            setData(response.data.results2023)
          } else {
            setData([])
          }
        })
    } catch (error) {
      console.error('error', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (filterName === '') {
      setFilterName('')
      setData([])
    }
  }, [filterName])

  return (
    <div>
      <div className="text-center text-2xl text-gray-300">Search for Registered Name</div>
      <div className="text-gray-300 text-sm mt-6 mb-2">
        <form onSubmit={handleSubmit}>
          <div className="w-full flex justify-between space-x-2">
            <div className='flex space-x-1'>
              <input
                placeholder='Search Name'
                className='outline-none text-black px-1 py-px w-48'
                onChange={e => setFilterName(e.target.value)}
                value={filterName}
                type='text'/>
              <button
                type='button'
                onClick={handleSearch}
                className='bg-green-600 hover:bg-green-700 text-xs text-white font-bold px-2 py-2'>Search</button>
                <button
                type='button'
                onClick={() => setFilterName('')}
                className='bg-gray-600 hover:bg-gray-700 text-xs text-white font-bold px-2 py-2'>Clear</button>
            </div>
          </div>
        </form>
      </div>
      { (filterName === '') && <div className='bg-gray-800 text-gray-400 text-center border border-dashed border-gray-400 py-10'>Search for name above</div> }
      { (filterName !== '' && data.length === 0) && <div className='bg-gray-800 text-gray-400 text-center border border-dashed border-gray-400 py-10'>No results found.</div> }
      { loading && <Loading/> }
      {
        (!loading && data.length > 0) &&
        <div className='w-full flex flex-col border bg-gray-200 px-4 py-2'>
          <table>
            <thead>
              <tr className='border-b border-gray-300'>
                <th className='text-xs px-1 text-left'>Fullname</th>
                <th className='text-xs px-1 text-left'>Precinct</th>
                <th className='text-xs px-1 text-left'>Service Provider</th>
              </tr>
            </thead>
            <tbody>
              {
                data.map((voter: NamesType, index) => (
                  <tr key={index} className='border-b border-gray-300'>
                    <td className='text-xs px-1 py-2'>
                      <div>{voter.fullname}</div>
                      <div className='text-green-700'>{voter.address}</div>
                      <div className='text-orange-600'>[R-{voter.id}]</div>
                    </td>
                    <td className='text-xs px-1 py-2'>{voter.precinct}</td>
                    <td className='text-xs px-1 py-2'>
                      {
                        voter.service_provider &&
                          <>
                            <div>{voter.service_provider.new !== '' ? voter.service_provider.new : voter.service_provider.name}</div>
                            <div className='text-green-700'>{voter.service_provider.barangay}</div>
                            <div className='text-orange-600'>[SP-{voter.service_provider.id}]</div>
                          </>
                      }
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  )
}

export default List