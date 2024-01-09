'use client'
import React, { useEffect, useState } from 'react'
import Loading from '@/components/Loading'
import axios from 'axios'
import toast from 'react-hot-toast'

interface SpsType {
  id: string
  name: string
  replacement: string
}

function Replacement({ sp }: { sp: SpsType }) {
  const [replacement, setReplacement] = useState(sp.replacement)

  const apiUrl = process.env.NEXT_PUBLIC_AO_API_URL ?? ''

  const handleSave = async () => {
    const params = {
      sp_id: sp.id,
      replacement,
    }

    try {
      await axios.put(`${apiUrl}/aorv/updatespreplacement`, params)
        .then((response: any) => {
          if (response.data === 'Success') {
            toast.success('Successfully saved')
          }
        })
    } catch (error) {
      console.error('error', error)
    }
  }

  return (
    <div>
      <div className='flex items-center space-x-1'>
        <input
          className='text-xs outline-none px-1 py-1 w-full'
          placeholder='Replacement Fullname(Lastname, Firstname Middlename)'
          value={replacement}
          onChange={e => setReplacement(e.target.value)}
          type='text'/>
        <button
          onClick={handleSave}
          className='text-xs bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-500 text-white px-1 py-1 rounded-sm'>Save</button>
      </div>
    </div>
  )
}
function List({ barangays}: { barangays: string[]}) {
  const [loading, setLoading] = useState(false)
  const [filterBarangay, setFilterBarangay] = useState('')
  const [data, setData] = useState<SpsType[] | []>([])

  const apiUrl = process.env.NEXT_PUBLIC_AO_API_URL ?? ''

  const fetchList = async () => {
    setLoading(true)

    const params = {
      filterBarangay
    }

    try {
      await axios.get(`${apiUrl}/aorv/splist`, { params })
        .then(response => {
          const d: SpsType[] = response.data

          setData(d)
        })
    } catch (error) {
      console.error('error', error)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchList()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterBarangay])

  return (
    <div>
      <div className="text-center text-2xl text-gray-300">SP Masterlist</div>
      {
        data.length > 0 && <div className='text-center text-xs text-gray-300'>{data.length} total results.</div>
      }
      <div className="text-gray-300 text-sm mt-6 mb-2">
        <div>
          <div className="w-full flex justify-start space-x-2">
            <div className='flex space-x-1'>
              <select
                onChange={e => setFilterBarangay(e.target.value)}
                className="border text-gray-600 outline-none w-32">
                  <option>Choose Barangay</option>
                  {
                    barangays.map((barangay: string, index) => <option key={index}>{barangay}</option>)
                  }
              </select>
            </div>
          </div>
        </div>
      </div>
      { (filterBarangay === '' || filterBarangay === 'Choose Barangay') && <div className='bg-gray-800 text-gray-400 text-center border border-dashed border-gray-400 py-10'>Please choose Barangay...</div> }
      { (filterBarangay !== '' && filterBarangay !== 'Choose Barangay' && data.length === 0) && <div className='bg-gray-800 text-gray-400 text-center border border-dashed border-gray-400 py-10'>No results found for this barangay.</div> }
      { loading && <Loading/> }
      {
        (!loading && data.length > 0) &&
          <div className='w-full flex flex-col border bg-gray-200 px-4 py-2'>
            <table>
              <thead>
                <tr className='border-b border-gray-300'>
                <th className='text-xs px-1 text-left'>SP-ID</th>
                  <th className='text-xs px-1 text-left'>Fullname</th>
                  <th className='text-xs px-1 text-left'>Replacement Fullname</th>
                </tr>
              </thead>
              <tbody>
                {
                  data.map((item: SpsType, index) => (
                    <tr key={index} className='border-b border-gray-300'>
                      <td className='text-xs px-1 py-2'>{item.id}</td>
                      <td className='text-xs px-1 py-2'>{item.name}</td>
                      <td className='py-2'>
                        {item.replacement}
                        {/* <Replacement
                          sp={item}
                        /> */}
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