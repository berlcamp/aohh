'use client'
import React, { useEffect, useState } from 'react'
import { FaLocationArrow } from "react-icons/fa"
import Loading from '@/components/Loading'
import axios from 'axios'
import toast from 'react-hot-toast'

interface HouseholdHeadType {
  id: string
  fullname: string
  sp_id: string
  sp_fullname: string
  sp_barangay?: string
  error_message?: string
}

function List({ barangays}: { barangays: string[]}) {
  const [loading, setLoading] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [inputValues, setInputValues] = useState<string[] | []>([])
  const [filterBarangay, setFilterBarangay] = useState('')
  const [filterName, setFilterName] = useState('')
  const [data, setData] = useState<HouseholdHeadType[] | []>([])
  const [originalData, setOriginalData] = useState<HouseholdHeadType[] | []>([])

  const apiUrl = process.env.NEXT_PUBLIC_AO_API_URL ?? ''

  const fetchData = async () => {
    if (filterBarangay === '') return
    setLoading(true)

    const params = {
      filterBarangay
    }

    try {
      await axios.get(`${apiUrl}/households/headssp`, { params })
        .then(response => {
          const d: HouseholdHeadType[] = response.data

          setData(d)
          setOriginalData(d)
          setFilterName('')
          setIsChecked(false)
        })
    } catch (error) {
      console.error('error', error)
    }

    setLoading(false)
  }

  const handleFilterName = (name: string) => {
    const filterByName = (name: string) => {
      const searchWords = name.toLowerCase().split(' ');

      return originalData.filter((head: HouseholdHeadType) => {
        const headname = head.fullname.toLowerCase()
        return searchWords.every(word => headname.includes(word));
      })
    }

    // Search for a specific name
    const searchResult = filterByName(name)
    setData(searchResult)
  }

  const handleFilterWithoutSP = () => {
    if (isChecked) {
      setFilterName('')

      const d = originalData.filter((item) => item.sp_id === null)
      setData(d)
    } else {
      fetchData()
    }
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
      await axios.put(`${apiUrl}/households/headspid`, params)
        .then((response: any) => {
          const errorMsg = response.data.error_message

          if (response.data.sp_fullname !== 'SP Not Found') {
            const d = originalData.map((item) => {
              if (item.id === id) {
                return { ...item, sp_id: response.data.sp_id, sp_fullname: response.data.sp_fullname, error_message: errorMsg }
              }
              return item
            })
            setOriginalData(d)

            const d2 = data.map((item) => {
              if (item.id === id) {
                return { ...item, sp_id: response.data.sp_id, sp_fullname: response.data.sp_fullname, error_message: errorMsg }
              }
              return item
            })
            setData(d2)
            toast.success('Successfully saved')
          } else {
            const d = originalData.map((item) => {
              if (item.id === id) {
                return { ...item, error_message: errorMsg }
              }
              return item
            })
            setOriginalData(d)

            const d2 = data.map((item) => {
              if (item.id === id) {
                return { ...item, error_message: errorMsg }
              }
              return item
            })
            setData(d2)
            toast.error('SP Not Found')
          }
        })
    } catch (error) {
      console.error('error', error)
    }
  }

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); // Toggles the checkbox state
  };

  useEffect(() => {
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterBarangay])

  useEffect(() => {
    handleFilterName(filterName)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterName])

  useEffect(() => {
    handleFilterWithoutSP()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChecked])

  return (
    <div>
      <div className="text-center text-2xl text-gray-300">Households Head SP</div>
      {
        data.length > 0 && <div className='text-center text-xs text-gray-300'>{data.length} total results.</div>
      }
      <div className="text-gray-300 text-sm mt-6 mb-2">
        <div>
          <div className="w-full flex justify-between space-x-2">
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
              <input
                placeholder='Search Name'
                className='outline-none text-black px-1 py-px w-32'
                onChange={e => setFilterName(e.target.value)}
                value={filterName}
                type='text'/>
              <button type='button' onClick={e => setFilterName('')} className='bg-gray-600 hover:bg-gray-700 text-xs px-1'>Clear</button>
            </div>
            <div className='flex justify-end flex-1'>
              <button
                type='button'
                onClick={handleCheckboxChange}
                className={`${ isChecked ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-xs text-white font-bold px-2 py-2`}>{ isChecked ? 'View All' : 'View w/Out SP' }</button>
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
                  <th className='text-xs px-1 text-left'>Head of Household</th>
                  <th className='text-xs px-1 text-left'>New SP-ID</th>
                  <th className='text-xs px-1 text-left'>SP Name</th>
                </tr>
              </thead>
              <tbody>
                {
                  data.map((head: HouseholdHeadType, index) => (
                    <tr key={index} className='border-b border-gray-300'>
                      <td className='text-xs px-1 py-2'>{head.fullname} (H-ID: {head.id})</td>
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
                              onClick={() => handleSave(index, head.id, head.sp_id)}
                              className='text-xs bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-500 text-white px-1 py-1 rounded-sm'>Save</button>
                          </div>
                        </div>
                        <div className='text-[10px] font-bold text-red-500'>{head.error_message}</div>
                      </td>
                      <td className='text-[10px] px-1 py-2'>
                        <div>{head.sp_fullname}</div>
                        <div className='text-orange-600'>{head.sp_id !== null ? `[SP-${head.sp_id}]` : ''}</div>
                        <div className='text-green-600 font-medium'>{head.sp_barangay}</div>
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