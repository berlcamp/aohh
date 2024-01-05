'use client'
import React, { useEffect, useState } from 'react'
import Loading from '@/components/Loading'
import axios from 'axios'
import toast from 'react-hot-toast'

interface SpsType {
  id: string
  name: string
}

interface VotersType {
  id: string
  fullname: string
  address: string
  sp_id: string
  sp_fullname: string
  error_message: string
}

function List({ barangays}: { barangays: string[]}) {
  const [loading, setLoading] = useState(false)
  const [inputValues, setInputValues] = useState<string[] | []>([])
  const [filterBarangay, setFilterBarangay] = useState('')
  const [filterName, setFilterName] = useState('')
  const [filterSpId, setFilterSpId] = useState('')
  const [sps, setSps] = useState<SpsType[] | []>([])
  const [data, setData] = useState<VotersType[] | []>([])

  const apiUrl = process.env.NEXT_PUBLIC_AO_API_URL ?? ''

  const fetchSps = async () => {
    setData([])
    if (filterBarangay === '') {
      setSps([])
      return
    }
    setLoading(true)

    const params = {
      filterBarangay
    }

    try {
      await axios.get(`${apiUrl}/aorv/splist`, { params })
        .then(response => {
          const d: SpsType[] = response.data

          setSps(d)
          setFilterName('')
        })
    } catch (error) {
      console.error('error', error)
    }

    setLoading(false)
  }

  const handleFetchSpMembers = async (spId: string) => {
    setFilterSpId(spId)

    setLoading(true)

    const params = {
      sp_id: spId,
      filterBarangay
    }

    try {
      await axios.get(`${apiUrl}/aorv/spmembers`, { params })
        .then(response => {
          const d: VotersType[] = response.data

          setData(d)
          setFilterName('')
        })
    } catch (error) {
      console.error('error', error)
    }

    setLoading(false)
  }

  const handleInputChange = (index: number, value: string) => {
    const values = [...inputValues]
    values[index] = value
    setInputValues(values)
  }

  const handleSave = async (index: number, id: string, originalSpId: string) => {
    // Access the value of the input field associated with the clicked button
    const spId = inputValues[index]

    // Perform any desired action with the value
    let param: any = {
      sp_id: spId,
      original_sp_id: originalSpId,
    }

    const params = {
      id: id,
      data: param
    }

    try {
      await axios.put(`${apiUrl}/aorv/updatespid`, params)
        .then((response: any) => {
          const d = data.map((item) => {
            if (item.id === id) {
              return { ...item, sp_id: response.data.sp_id, sp_fullname: response.data.sp_fullname, error_message: response.data.error_message }
            }
            return item
          })
          setData(d)

          if (response.data.error_message !== 'SP Not Found') {
            toast.success('Successfully saved')
          }
        })
    } catch (error) {
      console.error('error', error)
    }
  }

  useEffect(() => {
    fetchSps()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterBarangay])

  return (
    <div>
      <div className="text-center text-2xl text-gray-300">SP Members</div>
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
            <div className='flex space-x-1'>
              <select
                onChange={e => handleFetchSpMembers(e.target.value)}
                value={filterSpId}
                className="border text-gray-600 outline-none w-32">
                  <option>Choose SP</option>
                  {
                    sps.map((sp, index) => <option key={index} value={sp.id}>{sp.name}</option>)
                  }
                  <option value='nosp'>Without SP</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      { (filterBarangay === '' || filterBarangay === 'Choose Barangay') && <div className='bg-gray-800 text-gray-400 text-center border border-dashed border-gray-400 py-10'>Please choose Barangay...</div> }
      { (filterBarangay !== '' && filterBarangay !== 'Choose Barangay' && data.length === 0) && <div className='bg-gray-800 text-gray-400 text-center border border-dashed border-gray-400 py-10'>Please choose SP...</div> }
      { loading && <Loading/> }
      {
        (!loading && data.length > 0) &&
          <div className='w-full flex flex-col border bg-gray-200 px-4 py-2'>
            <div className='text-center mt-4 mb-10'>Members of SP <span className='font-bold'>{data[0].sp_fullname}</span></div>
            <table>
              <thead>
                <tr className='border-b border-gray-300'>
                  <th className='text-xs px-1 text-left'>Name of Member</th>
                  <th className='text-xs px-1 text-left'>New SP-ID</th>
                  <th className='text-xs px-1 text-left'>SP Name</th>
                </tr>
              </thead>
              <tbody>
                {
                  data.map((item: VotersType, index) => (
                    <tr key={index} className='border-b border-gray-300'>
                      <td className='text-xs px-1 py-2'>{item.fullname}</td>
                      <td className='py-2'>
                        <div>
                          <div className='flex items-center space-x-1'>
                            <span className='text-xs'>SP-</span>
                            <input
                              className='text-xs outline-none px-1 py-1 w-10'
                              placeholder='ID'
                              onChange={(e) => handleInputChange(index, e.target.value)}
                              type='text'/>
                            <button
                              onClick={() => handleSave(index, item.id, item.sp_id)}
                              className='text-xs bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-500 text-white px-1 py-1 rounded-sm'>Save</button>
                          </div>
                        </div>
                        <div className='text-[10px] font-bold text-red-500'>{item.error_message}</div>
                      </td>
                      <td className='text-[10px] px-1 py-2'>
                        <div>{item.sp_fullname}</div>
                        <div className='text-orange-600'>{item.sp_id !== null ? `[SP-${item.sp_id}]` : ''}</div>
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