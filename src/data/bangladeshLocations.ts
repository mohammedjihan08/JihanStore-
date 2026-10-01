export interface LocationDivision {
  name: string;
  banglaName: string;
  districts: {
    name: string;
    banglaName: string;
    upazilas?: string[];
  }[];
}

export const BANGLADESH_DIVISIONS: LocationDivision[] = [
  {
    name: 'Chittagong',
    banglaName: 'চট্টগ্রাম',
    districts: [
      {
        name: 'Chittagong',
        banglaName: 'চট্টগ্রাম',
        upazilas: [
          'Sandwip (সন্দ্বীপ)',
          'Chittagong Sadar (চট্টগ্রাম সদর)',
          'Pahartali',
          'Panchlaish',
          'Khulshi',
          'Halishahar',
          'Kotwali',
          'Hathazari',
          'Raozan',
          'Fatikchhari',
          'Sitakunda',
          'Mirsharai',
          'Patiya',
          'Boalkhali',
          'Anwara',
          'Chandanaish',
          'Lohagara',
          'Banshkhali',
          'Karnafuli'
        ]
      },
      { name: "Cox's Bazar", banglaName: "কক্সবাজার", upazilas: ['Sadar', 'Chakaria', 'Maheshkhali', 'Teknaf', 'Ukhiya', 'Ramu', 'Kutubdia', 'Pekua'] },
      { name: 'Cumilla', banglaName: 'কুমিল্লা', upazilas: ['Adarsha Sadar', 'Daudkandi', 'Chandina', 'Muradnagar', 'Debidwar', 'Homna', 'Laksam', 'Barura', 'Chauddagram'] },
      { name: 'Feni', banglaName: 'ফেনী', upazilas: ['Sadar', 'Daganbhuiyan', 'Chhagalnaiya', 'Parshuram', 'Fulgazi', 'Sonagazi'] },
      { name: 'Noakhali', banglaName: 'নোয়াখালী', upazilas: ['Sadar', 'Begumganj', 'Chatkhil', 'Senbagh', 'Companiganj', 'Hatiya', 'Kabirhat', 'Sonaimuri', 'Subarnachar'] },
      { name: 'Chandpur', banglaName: 'চাঁদপুর', upazilas: ['Sadar', 'Faridganj', 'Hajiganj', 'Matlab North', 'Matlab South', 'Shahrasti', 'Kachua', 'Haimchar'] },
      { name: 'Brahmanbaria', banglaName: 'ব্রাহ্মণবাড়িয়া', upazilas: ['Sadar', 'Kasba', 'Nasirnagar', 'Nabinagar', 'Bancharampur', 'Sarail', 'Ashuganj', 'Akhaura'] },
      { name: 'Rangamati', banglaName: 'রাঙ্গামাটি', upazilas: ['Sadar', 'Kaptai', 'Baghaichhari', 'Barkal', 'Langadu', 'Rajasthali', 'Belaichhari', 'Juraichhari', 'Naniarchar'] },
      { name: 'Bandarban', banglaName: 'বান্দরবান', upazilas: ['Sadar', 'Ruma', 'Thanchi', 'Rowangchhari', 'Lama', 'Alikadam', 'Naikhongchhari'] },
      { name: 'Khagrachhari', banglaName: 'খাগড়াছড়ি', upazilas: ['Sadar', 'Dighinala', 'Panchhari', 'Mahalchhari', 'Matiranga', 'Manikchhari', 'Ramgarh', 'Guimara'] },
      { name: 'Lakshmipur', banglaName: 'লক্ষ্মীপুর', upazilas: ['Sadar', 'Raipur', 'Ramganj', 'Ramgati', 'Kamalnagar'] }
    ]
  },
  {
    name: 'Dhaka',
    banglaName: 'ঢাকা',
    districts: [
      {
        name: 'Dhaka',
        banglaName: 'ঢাকা',
        upazilas: [
          'Dhanmondi', 'Gulshan', 'Banani', 'Uttara', 'Mirpur', 'Mohammadpur',
          'Motijheel', 'Tejgaon', 'Badda', 'Khilgaon', 'Old Dhaka (পুরান ঢাকা)',
          'Savar', 'Dhamrai', 'Keraniganj', 'Nawabganj', 'Dohar'
        ]
      },
      { name: 'Gazipur', banglaName: 'গাজীপুর', upazilas: ['Sadar', 'Tongi', 'Kaliakair', 'Kapasia', 'Sreepur', 'Kaliganj'] },
      { name: 'Narayanganj', banglaName: 'নারায়ণগঞ্জ', upazilas: ['Sadar', 'Bandar', 'Rupganj', 'Sonargaon', 'Araihazar'] },
      { name: 'Tangail', banglaName: 'টাঙ্গাইল', upazilas: ['Sadar', 'Mirzapur', 'Gopalpur', 'Madhupur', 'Ghatail', 'Kalihati', 'Sakhipur', 'Basail', 'Delduar', 'Nagarpur', 'Bhuapur', 'Dhanbari'] },
      { name: 'Kishoreganj', banglaName: 'কিশোরগঞ্জ', upazilas: ['Sadar', 'Bhairab', 'Bajitpur', 'Katiadi', 'Pakundia', 'Karimganj', 'Tarail', 'Hossainpur', 'Kuliarchar', 'Austagram', 'Mithamain', 'Itna', 'Nikli'] },
      { name: 'Manikganj', banglaName: 'মানিকগঞ্জ', upazilas: ['Sadar', 'Singair', 'Saturia', 'Ghior', 'Shivalaya', 'Harirampur', 'Daulatpur'] },
      { name: 'Munshiganj', banglaName: 'মুন্সীগঞ্জ', upazilas: ['Sadar', 'Sreenagar', 'Sirajdikhan', 'Lohajang', 'Tongibari', 'Gazaria'] },
      { name: 'Narsingdi', banglaName: 'নরসিংদী', upazilas: ['Sadar', 'Palash', 'Shibpur', 'Belabo', 'Monohardi', 'Raipura'] },
      { name: 'Faridpur', banglaName: 'ফরিদপুর', upazilas: ['Sadar', 'Madhukhali', 'Boalmari', 'Alfadanga', 'Nagarkanda', 'Bhanga', 'Sadarpur', 'Charbhadrasan', 'Saltha'] },
      { name: 'Gopalganj', banglaName: 'গোপালগঞ্জ', upazilas: ['Sadar', 'Kashiani', 'Kotalipara', 'Muksudpur', 'Tungipara'] },
      { name: 'Madaripur', banglaName: 'মাদারীপুর', upazilas: ['Sadar', 'Shibchar', 'Kalkini', 'Rajoir', 'Dasar'] },
      { name: 'Rajbari', banglaName: 'রাজবাড়ী', upazilas: ['Sadar', 'Goalanda', 'Pangsha', 'Baliakandi', 'Kalukhali'] },
      { name: 'Shariatpur', banglaName: 'শরীয়তপুর', upazilas: ['Sadar', 'Zajira', 'Naria', 'Bhedarganj', 'Damudya', 'Gosairhat'] }
    ]
  },
  {
    name: 'Rajshahi',
    banglaName: 'রাজশাহী',
    districts: [
      { name: 'Rajshahi', banglaName: 'রাজশাহী', upazilas: ['Boalia', 'Motihar', 'Rajpara', 'Shah Makhdum', 'Godagari', 'Tanore', 'Mohanpur', 'Bagmara', 'Durgapur', 'Puthia', 'Charghat', 'Bagha'] },
      { name: 'Bogura', banglaName: 'বগুড়া', upazilas: ['Sadar', 'Sherpur', 'Shibganj', 'Gabtali', 'Shajahanpur', 'Kahaloo', 'Nandigram', 'Adamdighi', 'Dupchanchia', 'Sonatala', 'Sariakandi', 'Dhunat'] },
      { name: 'Pabna', banglaName: 'পাবনা', upazilas: ['Sadar', 'Ishwardi', 'Sujanagar', 'Santhia', 'Chatmohar', 'Bhangura', 'Faridpur', 'Bera', 'Atgharia'] },
      { name: 'Sirajganj', banglaName: 'সিরাজগঞ্জ', upazilas: ['Sadar', 'Kazipur', 'Ullapara', 'Shahjadpur', 'Raiganj', 'Tarash', 'Belkuchi', 'Kamarkhanda', 'Chauhali'] },
      { name: 'Naogaon', banglaName: 'নওগাঁ', upazilas: ['Sadar', 'Manda', 'Mohadevpur', 'Patnitala', 'Badalgachhi', 'Niamatpur', 'Raninagar', 'Atrai', 'Sapahar', 'Porsha', 'Dhamoirhat'] },
      { name: 'Natore', banglaName: 'নাটোর', upazilas: ['Sadar', 'Baraigram', 'Bagatipara', 'Gurudaspur', 'Lalpur', 'Singra', 'Naldanga'] },
      { name: 'Chapai Nawabganj', banglaName: 'চাঁপাইনবাবগঞ্জ', upazilas: ['Sadar', 'Shibganj', 'Gomastapur', 'Nachole', 'Bholahat'] },
      { name: 'Joypurhat', banglaName: 'জয়পুরহাট', upazilas: ['Sadar', 'Panchbibi', 'Kalai', 'Khetlal', 'Akkelpur'] }
    ]
  },
  {
    name: 'Khulna',
    banglaName: 'খুলনা',
    districts: [
      { name: 'Khulna', banglaName: 'খুলনা', upazilas: ['Sadar', 'Sonadanga', 'Khalishpur', 'Daulatpur', 'Khan Jahan Ali', 'Dighalia', 'Rupsha', 'Terokhada', 'Dumuria', 'Batiaghata', 'Dacope', 'Paikgachha', 'Koyra', 'Phultala'] },
      { name: 'Jashore', banglaName: 'যশোর', upazilas: ['Sadar', 'Jhikargachha', 'Sharsha', 'Manirampur', 'Chaugachha', 'Keshabpur', 'Bagherpara', 'Abhaynagar'] },
      { name: 'Satkhira', banglaName: 'সাতক্ষীরা', upazilas: ['Sadar', 'Kalaroa', 'Tala', 'Debhata', 'Kaliganj', 'Assasuni', 'Shyamnagar'] },
      { name: 'Kushtia', banglaName: 'কুষ্টিয়া', upazilas: ['Sadar', 'Kumarkhali', 'Khoksa', 'Mirpur', 'Bheramara', 'Daulatpur'] },
      { name: 'Jhenaidah', banglaName: 'ঝিনাইদহ', upazilas: ['Sadar', 'Kaliganj', 'Kotchandpur', 'Maheshpur', 'Shailkupa', 'Harinakunda'] },
      { name: 'Bagerhat', banglaName: 'বাগেরহাট', upazilas: ['Sadar', 'Mongla', 'Fakirhat', 'Kachua', 'Mollahat', 'Rampal', 'Morrelganj', 'Sarankhola', 'Chitalmari'] },
      { name: 'Chuadanga', banglaName: 'চুয়াডাঙ্গা', upazilas: ['Sadar', 'Alamdanga', 'Damurhuda', 'Jibannagar'] },
      { name: 'Meherpur', banglaName: 'মেহেরপুর', upazilas: ['Sadar', 'Gangni', 'Mujibnagar'] },
      { name: 'Narail', banglaName: 'নড়াইল', upazilas: ['Sadar', 'Lohagara', 'Kalia'] },
      { name: 'Magura', banglaName: 'মাগুরা', upazilas: ['Sadar', 'Sreepur', 'Mohammadpur', 'Shalikha'] }
    ]
  },
  {
    name: 'Barisal',
    banglaName: 'বরিশাল',
    districts: [
      { name: 'Barisal', banglaName: 'বরিশাল', upazilas: ['Sadar', 'Bakerganj', 'Babuganj', 'Wazirpur', 'Banaripara', 'Gournadi', 'Agailjhara', 'Mehendiganj', 'Muladi', 'Hizla'] },
      { name: 'Bhola', banglaName: 'ভোলা', upazilas: ['Sadar', 'Daulatkhan', 'Borhanuddin', 'Lalmohan', 'Char Fasson', 'Tazumuddin', 'Manpura'] },
      { name: 'Patuakhali', banglaName: 'পটুয়াখালী', upazilas: ['Sadar', 'Dumki', 'Mirzaganj', 'Bauphal', 'Galachipa', 'Dashmina', 'Kalapara', 'Rangabali'] },
      { name: 'Pirojpur', banglaName: 'পিরোজপুর', upazilas: ['Sadar', 'Nesarabad', 'Bhandaria', 'Mathbaria', 'Kawkhali', 'Nazirpur', 'Indurkani'] },
      { name: 'Jhalokati', banglaName: 'ঝালকাঠি', upazilas: ['Sadar', 'Nalchity', 'Rajapur', 'Kathalia'] },
      { name: 'Barguna', banglaName: 'বরগুনা', upazilas: ['Sadar', 'Amtali', 'Patharghata', 'Betagi', 'Bamna', 'Taltali'] }
    ]
  },
  {
    name: 'Sylhet',
    banglaName: 'সিলেট',
    districts: [
      { name: 'Sylhet', banglaName: 'সিলেট', upazilas: ['Sadar', 'Beanibazar', 'Golapganj', 'Companiganj', 'Fenchuganj', 'Balaganj', 'Biswanath', 'Zakiganj', 'Kanaighat', 'Jaintiapur', 'Gowainghat', 'Dakshin Surma', 'Osmani Nagar'] },
      { name: 'Moulvibazar', banglaName: 'মৌলভীবাজার', upazilas: ['Sadar', 'Sreemangal', 'Kamalganj', 'Kulaura', 'Rajnagar', 'Barlekha', 'Juri'] },
      { name: 'Habiganj', banglaName: 'হবিগঞ্জ', upazilas: ['Sadar', 'Nabiganj', 'Madhabpur', 'Chunarughat', 'Bahubal', 'Baniachong', 'Ajmiriganj', 'Lakhai', 'Sayestaganj'] },
      { name: 'Sunamganj', banglaName: 'সুনামগঞ্জ', upazilas: ['Sadar', 'South Sunamganj', 'Chhatak', 'Jagannathpur', 'Derai', 'Tahirpur', 'Dharmapasha', 'Jamalganj', 'Shalla', 'Bishwamvarpur', 'Dowarabazar', 'Madhyanagar'] }
    ]
  },
  {
    name: 'Rangpur',
    banglaName: 'রংপুর',
    districts: [
      { name: 'Rangpur', banglaName: 'রংপুর', upazilas: ['Sadar', 'Badarganj', 'Gangachhara', 'Kaunia', 'Mithapukur', 'Pirgachha', 'Pirganj', 'Taraganj'] },
      { name: 'Dinajpur', banglaName: 'দিনাজপুর', upazilas: ['Sadar', 'Birganj', 'Biral', 'Bochaganj', 'Kaharole', 'Khansama', 'Chirirbandar', 'Parbatipur', 'Fulbari', 'Nawabganj', 'Ghoraghat', 'Hakimpur'] },
      { name: 'Kurigram', banglaName: 'কুড়িগ্রাম', upazilas: ['Sadar', 'Nageshwari', 'Bhurungamari', 'Fulbari', 'Rajarhat', 'Ulipur', 'Chilmari', 'Rowmari', 'Char Rajibpur'] },
      { name: 'Gaibandha', banglaName: 'গাইবান্ধা', upazilas: ['Sadar', 'Gobindaganj', 'Sundarganj', 'Palashbari', 'Sadullapur', 'Saghata', 'Fulchhari'] },
      { name: 'Nilphamari', banglaName: 'নীলফামারী', upazilas: ['Sadar', 'Saidpur', 'Jaldhaka', 'Kishoreganj', 'Domar', 'Dimla'] },
      { name: 'Thakurgaon', banglaName: 'ঠাকুরগাঁও', upazilas: ['Sadar', 'Pirganj', 'Ranisankail', 'Baliadangi', 'Haripur'] },
      { name: 'Panchagarh', banglaName: 'পঞ্চগড়', upazilas: ['Sadar', 'Boda', 'Debiganj', 'Atwari', 'Tetulia'] },
      { name: 'Lalmonirhat', banglaName: 'লালমনিরহাট', upazilas: ['Sadar', 'Kaliganj', 'Hatibandha', 'Patgram', 'Aditmari'] }
    ]
  },
  {
    name: 'Mymensingh',
    banglaName: 'ময়মনসিংহ',
    districts: [
      { name: 'Mymensingh', banglaName: 'ময়মনসিংহ', upazilas: ['Sadar', 'Trishal', 'Bhaluka', 'Muktagachha', 'Gafargaon', 'Fulbaria', 'Haluaghat', 'Dhobaura', 'Phulpur', 'Tarakanda', 'Gauripur', 'Ishwarganj', 'Nandail'] },
      { name: 'Jamalpur', banglaName: 'জামালপুর', upazilas: ['Sadar', 'Melandaha', 'Islampur', 'Dewanganj', 'Sarishabari', 'Madarganj', 'Bakshiganj'] },
      { name: 'Netrokona', banglaName: 'নেত্রকোণা', upazilas: ['Sadar', 'Barhatta', 'Durgapur', 'Kendua', 'Atpara', 'Madan', 'Khaliajuri', 'Kalmakanda', 'Mohanganj', 'Purbadhala'] },
      { name: 'Sherpur', banglaName: 'শেরপুর', upazilas: ['Sadar', 'Nalitabari', 'Sreebardi', 'Nakla', 'Jhenaigati'] }
    ]
  }
];

// Helper to get all districts flat list
export const ALL_DISTRICTS: string[] = BANGLADESH_DIVISIONS.flatMap(div =>
  div.districts.map(d => d.name)
).sort();
