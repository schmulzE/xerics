import { motion } from 'framer-motion';
import { CheckCircle, Clock, BarChart3, Kanban, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CalendarPage from '../../assets/images/calendar_page.png'
import ProjectDetailsPage from '../../assets/images/project_details_page.png'
import AnalysisPage from '../../assets/images/report_page.png'

const features = [
  {
    icon: Kanban,
    title: "Kanban Boards",
    description: "Visualize your workflow with intuitive drag-and-drop boards",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Calendar,
    title: "Smart Calendar",
    description: "Schedule tasks and track deadlines with our integrated calendar",
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Get insights into your team's productivity and project progress",
    color: "from-blue-600 to-indigo-600",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly with real-time updates and notifications",
    color: "from-indigo-600 to-purple-600",
  },
]

const Features = () => {
  return (
    <div id='features'>
      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to boost your team&#39;s productivity and streamline project management.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Card className="h-full border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-xl">
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-800">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Features */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">Kanban Boards That Actually Work</h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Create custom workflows, drag and drop tasks, and visualize your project progress with our intuitive
                kanban boards. Perfect for agile teams and complex projects.
              </p>
              <div className="space-y-4">
                {[
                  "Drag & drop interface",
                  "Custom columns and workflows",
                  "Real-time collaboration",
                  "Advanced filtering and search",
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-2xl blur-2xl" />
              <div className="relative bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
                <img
                  src={ProjectDetailsPage}
                  alt="Kanban Board"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Calendar Feature */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative lg:order-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-2xl blur-2xl" />
              <div className="relative bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
                <img
                  src={CalendarPage}
                  alt="Calendar View"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:order-1"
            >
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">Smart Calendar Integration</h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Never miss a deadline again. Our smart calendar syncs with your tasks, shows project timelines, and
                helps you plan your work efficiently.
              </p>
              <div className="space-y-4">
                {[
                  "Automatic deadline tracking",
                  "Team availability overview",
                  "Meeting scheduling",
                  "Timeline visualization",
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <Clock className="w-5 h-5 text-cyan-600" />
                    <span className="text-gray-700">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Analytics Feature */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">Powerful Analytics & Reports</h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Get deep insights into your team&#39;s performance, project progress, and productivity trends. Make
                data-driven decisions with comprehensive reporting.
              </p>
              <div className="space-y-4">
                {[
                  "Real-time performance metrics",
                  "Custom report generation",
                  "Team productivity insights",
                  "Project timeline analysis",
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-2xl blur-2xl" />
              <div className="relative bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
                <img
                  src={AnalysisPage}
                  alt="Analytics Dashboard"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Features;