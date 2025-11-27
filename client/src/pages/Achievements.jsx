import AnimatedSection from '../components/AnimatedSection'
import { Trophy, Award, Star, TrendingUp } from 'lucide-react'

const Achievements = () => {
  const achievements = [
    {
      title: 'Smart India Hackathon 2024 - Winners',
      description: 'Team of 6 students won the grand prize for developing an AI-based healthcare solution',
      date: 'March 2024',
      icon: <Trophy size={32} />
    },
    {
      title: 'Best Paper Award at ICCSIT Conference',
      description: 'Research paper on Machine Learning in Healthcare won best paper award',
      date: 'February 2024',
      icon: <Award size={32} />
    },
    {
      title: 'Hackathon Winners - Code for Good',
      description: 'Students secured 1st place in JP Morgan Code for Good hackathon',
      date: 'January 2024',
      icon: <Star size={32} />
    },
    {
      title: 'Google Summer of Code Selection',
      description: '3 students selected for GSoC 2024 to work on open-source projects',
      date: 'April 2024',
      icon: <TrendingUp size={32} />
    },
  ]

  const placements = [
    { company: 'TCS', students: 45, package: '3.5 LPA' },
    { company: 'Infosys', students: 38, package: '4.0 LPA' },
    { company: 'Wipro', students: 30, package: '3.8 LPA' },
    { company: 'Cognizant', students: 25, package: '4.2 LPA' },
    { company: 'Accenture', students: 20, package: '4.5 LPA' },
    { company: 'Capgemini', students: 15, package: '4.0 LPA' },
    { company: 'Tech Mahindra', students: 12, package: '3.6 LPA' },
    { company: 'Amazon', students: 5, package: '12.0 LPA' },
    { company: 'Microsoft', students: 3, package: '18.0 LPA' },
    { company: 'Google', students: 2, package: '25.0 LPA' },
  ]

  const internships = [
    { student: 'Rahul Sharma', company: 'Google', role: 'Software Engineering Intern' },
    { student: 'Priya Reddy', company: 'Microsoft', role: 'ML Research Intern' },
    { student: 'Aditya Kumar', company: 'Amazon', role: 'SDE Intern' },
    { student: 'Sneha Patel', company: 'Flipkart', role: 'Data Science Intern' },
    { student: 'Karthik R', company: 'IBM', role: 'Cloud Computing Intern' },
  ]

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-pesitm-blue to-blue-900 text-white py-16">
        <div className="container-custom">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Student Achievements</h1>
            <p className="text-xl text-gray-200">Celebrating excellence and success</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8">
            <AnimatedSection>
              <div className="card text-center bg-white">
                <div className="text-4xl font-bold text-pesitm-blue mb-2">95%</div>
                <p className="text-gray-600">Placement Rate</p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="card text-center bg-white">
                <div className="text-4xl font-bold text-pesitm-blue mb-2">₹25L</div>
                <p className="text-gray-600">Highest Package</p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="card text-center bg-white">
                <div className="text-4xl font-bold text-pesitm-blue mb-2">₹4.5L</div>
                <p className="text-gray-600">Average Package</p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="card text-center bg-white">
                <div className="text-4xl font-bold text-pesitm-blue mb-2">50+</div>
                <p className="text-gray-600">Recruiting Companies</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Recent Achievements */}
      <section className="py-16">
        <div className="container-custom">
          <AnimatedSection>
            <h2 className="section-heading text-center mb-12">Recent Achievements</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            {achievements.map((achievement, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <div className="card flex items-start space-x-4 hover:border-l-4 hover:border-pesitm-blue transition-all">
                  <div className="flex-shrink-0 p-3 bg-pesitm-blue text-white rounded-lg">
                    {achievement.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-pesitm-blue mb-2">
                      {achievement.title}
                    </h3>
                    <p className="text-gray-600 mb-2">{achievement.description}</p>
                    <p className="text-sm text-gray-500">{achievement.date}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Top Recruiters */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <AnimatedSection>
            <h2 className="section-heading text-center mb-12">Placement Statistics 2024</h2>
          </AnimatedSection>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
              <thead className="bg-pesitm-blue text-white">
                <tr>
                  <th className="px-8 py-4 text-left font-semibold w-1/3">Company</th>
                  <th className="px-8 py-4 text-center font-semibold w-1/3">Students Placed</th>
                  <th className="px-8 py-4 text-right font-semibold w-1/3">Package (CTC)</th>
                </tr>
              </thead>
              <tbody>
                {placements.map((placement, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition">
                    <td className="px-8 py-4 text-left font-semibold text-gray-800">{placement.company}</td>
                    <td className="px-8 py-4 text-center font-medium text-gray-700 tabular-nums">{placement.students}</td>
                    <td className="px-8 py-4 text-right font-semibold text-green-600 tabular-nums">
                      ₹{placement.package}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Internships */}
      <section className="py-16">
        <div className="container-custom">
          <AnimatedSection>
            <h2 className="section-heading text-center mb-12">Notable Internships</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internships.map((internship, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <div className="card hover:scale-105 transition-transform">
                  <h3 className="font-bold text-lg text-pesitm-blue mb-2">
                    {internship.student}
                  </h3>
                  <p className="text-gray-600 mb-1">{internship.role}</p>
                  <p className="text-sm font-semibold text-pesitm-gold">
                    @ {internship.company}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-pesitm-blue text-white">
        <div className="container-custom text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Be Part of Our Success Story
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              Join our department and create your own achievement milestones
            </p>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}

export default Achievements
