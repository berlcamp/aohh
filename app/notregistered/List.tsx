'use client'
import React, { useEffect, useState } from 'react'
import Loading from '@/components/Loading'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Ref } from './Ref'

interface MembersType {
  id: string
  lastname: string
  firstname: string
  middlename: string
  voter_id: string
}

interface HouseholdsType {
  household_id: string
  barangay: string
  members: MembersType[]
}

function List({ barangays}: { barangays: string[]}) {
  const [loading, setLoading] = useState(false)
  const [inputValues, setInputValues] = useState<string[] | []>([])
  const [filterBarangay, setFilterBarangay] = useState('')
  const [filterName, setFilterName] = useState('')
  const [data, setData] = useState<HouseholdsType[] | []>([])
  const [originalData, setOriginalData] = useState<HouseholdsType[] | []>([])

  const apiUrl = process.env.NEXT_PUBLIC_AO_API_URL ?? ''

  const fetchData = async () => {
    if (filterBarangay === '') return
    setLoading(true)

    const params = {
      filterBarangay
    }

    try {
      await axios.get(`${apiUrl}/households/nrs`, { params })
        .then(response => {
          const d: HouseholdsType[] = response.data

          setData(d)
          setOriginalData(d)
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

  const handleUpdateList = async (householdId: string) => {
    const d = data.filter(d => d.household_id !== householdId)
    setData(d)
  }

  const handleFilterName = (name: string) => {
    const filterByName = (name: string) => {
      const searchWords = name.toLowerCase().split(' ');

      return originalData.filter((household: HouseholdsType) => {
        let fullName = ''
        household.members.forEach((member: MembersType) => {
          fullName = `${fullName} ${member.lastname} ${member.firstname} ${member.middlename}`.toLowerCase();
        })
        fullName = fullName.toLowerCase()
        return searchWords.every(word => fullName.includes(word));
      })
    }

    // Search for a specific name
    const searchResult = filterByName(name)
    setData(searchResult)
  }

  const handleRefresh = () => {
    fetchData()
  };

  useEffect(() => {
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterBarangay])

  useEffect(() => {
    handleFilterName(filterName)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterName])

  return (
    <div>
      <div className="text-center text-2xl text-gray-300">Not Registered</div>
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
            {/* <div className='flex space-x-1'>
              <input
                placeholder='Search Name'
                className='outline-none text-black px-1 py-px w-32'
                onChange={e => setFilterName(e.target.value)}
                value={filterName}
                type='text'/>
              <button type='button' onClick={e => setFilterName('')} className='bg-gray-600 hover:bg-gray-700 text-xs px-1'>Clear</button>
            </div> */}
            <div className='flex justify-end flex-1'>
              <button
                type='button'
                onClick={handleRefresh}
                className='bg-green-600 hover:bg-green-700 text-xs text-white font-bold px-2 py-2'>Refresh</button>
            </div>
          </div>
        </div>
      </div>
      { (filterBarangay === '' || filterBarangay === 'Choose Barangay') && <div className='bg-gray-800 text-gray-400 text-center border border-dashed border-gray-400 py-10'>Please choose Barangay...</div> }
      { (filterBarangay !== '' && filterBarangay !== 'Choose Barangay' && data.length === 0) && <div className='bg-gray-800 text-gray-400 text-center border border-dashed border-gray-400 py-10'>No results found for this barangay.</div> }
      { loading && <Loading/> }
      {
        (!loading && data.length > 0) &&
          <div className='flex flex-wrap gap-2 px-4 py-2'>
            {
              data.map((household: HouseholdsType, index) => (
                <div key={index} className='bg-yellow-200 text-xs text-left space-y-1 px-4 py-2 w-full sm:w-96'>
                  <div className='flex justify-between'>
                    <div className='font-medium'>H-ID: {household.household_id}</div>
                  </div>
                  <div className='text-center font-bold text-sm'>{household.barangay}</div>
                  {
                    household.members.map((member: MembersType, index) => (
                      <React.Fragment key={index}>
                        {
                          index === 0 && <div className='font-bold text-sm px-1'>Head</div>
                        }
                        {
                          index === 1 && <div className='font-bold text-sm px-1'>Members</div>
                        }
                        <div className="flex items=center justify-between gap-1">
                          <div className='text-sm px-1'>{member.lastname}, {member.firstname} {member.middlename}</div>
                          {/* <Ref
                            handleUpdateList={handleUpdateList}
                            memberId={member.id}
                            householdId={household.household_id}/> */}
                        </div>
                      </React.Fragment>
                    ))
                  }
                </div>
              ))
            }
          </div>
      }
    </div>
  )
}

export default List