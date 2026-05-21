import React from 'react'
import Hero from './Hero'
import AllTeachersDisplay from '../Pages/AllTeachersDisplay'
import EducationalGrid from './EducationalGrid'
import ExamHeroHighlightListDisplay from '../Pages/ExamHeroHighlightListDisplay'





const Home = () => {
  return (
    <div>
      <Hero></Hero>
      <AllTeachersDisplay></AllTeachersDisplay>
      
      <EducationalGrid></EducationalGrid>
      <ExamHeroHighlightListDisplay></ExamHeroHighlightListDisplay>
     
  
    
     
    </div>
  )
}

export default Home