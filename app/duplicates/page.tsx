import Households from "./Households"
import { currentUser } from '@clerk/nextjs'

export default async function Home() {
  const user = await currentUser()

  const id = user?.id
  let barangays: string[] = []

  // Kons John && Berl
  if (id === 'user_2ZD0PFrBO6XZQgG556uPRcTiUj4' || id === 'user_2ZA73AGLyPUkOXHfSWwNODxsMrG') {
    barangays.push('Carmen (Misamis Annex)', 'Baybay Triunfo', 'Maningcol', 'Catadman-Manabay')
  }
  // Kap Canlas && Berl
  if (id === 'user_2ZD0ywdhBjM9brDROIiJyl4ARg3' || id === 'user_2ZDJpzC640xTT9Ks7hjS5XKaown' || id === 'user_2ZA73AGLyPUkOXHfSWwNODxsMrG') {
    barangays.push('Tabid', 'Manaka', 'Diguan', 'Litapan', 'Labinay', 'Sinuza')
  }
  // Kons Kat2x && Berl
  if (id === 'user_2ZD3d1Uqtyif7B28biTtCEy5xsw' || id === 'user_2ZF0tBifmDW1jkGm7VPEsP9jxq4' || id === 'user_2ZA73AGLyPUkOXHfSWwNODxsMrG') {
    barangays.push('50TH District', 'Baybay San Roque', 'Baybay Santa Cruz', 'Aguada')
  }

  // Kap Ignacio && Berl
  if (id === 'user_2ZEe6J3e425Pyg087u8xaGEryg0' || id === 'user_2ZA73AGLyPUkOXHfSWwNODxsMrG') {
    barangays.push('Cogon', 'Gala', 'Guimad', 'Guingona', 'Kinuman Norte', 'Kinuman Sur', 'Trigos')
  }

  // Kap Linsag && Berl
  if (id === 'user_2ZDNOTz5TqFwpPTyJXyNMiItCfh' || id === 'user_2ZA73AGLyPUkOXHfSWwNODxsMrG') {
    barangays.push('Balintawak', 'Bongbong', 'Cavinte', 'Dimaluna', 'Pulot', 'Tinago')
  }

  // Board Nemi && Berl
  if (id === 'user_2ZDEYgFL5Ql1hY9ADm6rutC99Ia' || id === 'user_2ZA73AGLyPUkOXHfSWwNODxsMrG') {
    barangays.push('Calabayan', 'Carangan', 'Lam-an', 'Liposong', 'Mentering', 'Pantaon', 'Dalapang', '50TH District')
  }

  // Kons Saulo && Berl
  if (id === 'user_2ZD8uDT8asWhJ7qmPnX7gGjSmKi' || id === 'user_2ZF10JPetBla9IZkTxuUUKEoqS0' || id === 'user_2ZA73AGLyPUkOXHfSWwNODxsMrG') {
    barangays.push('Banadero', 'Malaubang', 'Bagakay', 'Capucao C', 'Gotocan Diot')
  }

  // Kons Saquin && Berl
  if (id === 'user_2ZD612tDgYtKgSwGWZ56A6z2A8E' || id === 'user_2ZA73AGLyPUkOXHfSWwNODxsMrG') {
    barangays.push('Gango', 'Dona Consuelo', 'Bacolod', 'San Antonio')
  }

  // Kap JCM && Berl
  if (id === 'user_2ZEiIftLPL9kUiCAuHIjWBvbmHm' || id === 'user_2ZA73AGLyPUkOXHfSWwNODxsMrG') {
    barangays.push('Capucao P', 'Embargo', 'Gotocan Daku', 'Labo', 'Molicay', 'Sangay Daku', 'Sangay Diot', 'Stimson Abordo (Montol)')
  }

  return (
    <div className="px-4 mx-auto">
      <div className='text-center pt-10 text-bold text-gray-300'>This function is no longer available, please contact Berl if you have concern.</div>
      {/* <div className='sm:fixed sm:top-32 sm:left-5 mt-2 sm:mt-0 mb-4'>
        <div className="text-white">Legend:</div>
        <div className="text-gray-300 text-xs mt-2 flex flex-col items-start gap-3">
          <div>
            <div>Active Household</div>
            <div className="h-8 w-8 bg-yellow-200"></div>
          </div>

          <div>
            <div>Deleted Household</div>
            <div className="h-8 w-8 bg-red-500"></div>
          </div>

          <div>
            <div>Deleted Member</div>
            <div className="h-2 w-16 bg-red-500"></div>
          </div>

          <div>
            <div>Possible Duplicate</div>
            <div className="mt-4 h-px w-16 bg-green-500"></div>
          </div>
        </div>
      </div>
      <div className="ml-0 sm:ml-32">
        <Households barangays={barangays}/>
      </div> */}
    </div>
  )
}
