
import mongoose from 'mongoose';
import Course from '../models/Course.js';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://sumanga:123@cluster0.othjbmr.mongodb.net/?appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const updateBasicPLCSyllabus = async () => {
  try {
    const courseCode = "ROB-101"; // Basic PLC Programming course
    
    const course = await Course.findOne({ code: courseCode });
    if (!course) {
      console.log(`❌ Course with code ${courseCode} not found`);
      return;
    }

    // Update the course with exact 19-day syllabus from your provided structure
    course.syllabus = [
      {
        "dayNumber": 1,
        "dayTitle": "Programming Fundamentals & Basic Robotics",
        "totalDuration": 480,
        "items": [
          {
            "title": "Introduction to Programming Concepts",
            "duration": 45,
            "type": "theory",
            "description": "What is a program, algorithms, flow of execution, and programming paradigms"
          },
          {
            "title": "C Programming Basics & Examples",
            "duration": 60,
            "type": "theory",
            "description": "C language syntax, structure, data types, and basic program examples"
          },
          {
            "title": "Microcontroller Architecture Overview",
            "duration": 45,
            "type": "theory",
            "description": "Microcontroller vs microprocessor, architecture components, and applications"
          },
          {
            "title": "Arduino Platform Introduction",
            "duration": 45,
            "type": "theory",
            "description": "Arduino ecosystem, board types, IDE setup, and basic programming structure"
          },
          {
            "title": "Basic LED Control Practical",
            "duration": 45,
            "type": "practical",
            "description": "Controlling LEDs with Arduino digital outputs and basic circuits"
          },
          {
            "title": "High Power Device Control with Relays",
            "duration": 60,
            "type": "practical",
            "description": "Interfacing relays to control high voltage/current devices safely"
          },
          {
            "title": "Seven Segment Display Theory",
            "duration": 30,
            "type": "theory",
            "description": "Seven segment display working principle, common anode/cathode types"
          },
          {
            "title": "Seven Segment Display Practical",
            "duration": 45,
            "type": "practical",
            "description": "Wiring and programming seven segment displays with Arduino"
          },
          {
            "title": "Pneumatic Systems Fundamentals",
            "duration": 45,
            "type": "theory",
            "description": "Pneumatic principles, components, and industrial applications"
          },
          {
            "title": "Pneumatic Components Identification",
            "duration": 30,
            "type": "demo",
            "description": "Hands-on identification of cylinders, valves, compressors, and fittings"
          },
          {
            "title": "Pick and Place Robot Arm Project",
            "duration": 60,
            "type": "project",
            "description": "Building and programming a pneumatic pick and place robotic arm"
          }
        ]
      },
      {
        "dayNumber": 2,
        "dayTitle": "Memory Management & Motor Control Fundamentals",
        "totalDuration": 480,
        "items": [
          {
            "title": "Memory Management in Embedded Systems",
            "duration": 45,
            "type": "theory",
            "description": "RAM, ROM, Flash memory, memory mapping, and optimization techniques"
          },
          {
            "title": "C Variables and Data Types",
            "duration": 60,
            "type": "theory",
            "description": "Variable declaration, data types, scope, and memory allocation"
          },
          {
            "title": "Arithmetic Operations in C",
            "duration": 45,
            "type": "theory",
            "description": "Basic arithmetic, operator precedence, and expression evaluation"
          },
          {
            "title": "User Input with scanf()",
            "duration": 45,
            "type": "practical",
            "description": "Getting user inputs through serial monitor and processing data"
          },
          {
            "title": "Average Calculation Project",
            "duration": 45,
            "type": "project",
            "description": "Program to calculate average of multiple numbers with user input"
          },
          {
            "title": "DC Motor Control Theory",
            "duration": 45,
            "type": "theory",
            "description": "DC motor working principles, specifications, and control methods"
          },
          {
            "title": "L298N Motor Driver Deep Dive",
            "duration": 45,
            "type": "theory",
            "description": "Motor driver IC working, H-bridge configuration, and current handling"
          },
          {
            "title": "Robot Chassis Movement Practical",
            "duration": 60,
            "type": "practical",
            "description": "Controlling robot chassis movement with motor driver and Arduino"
          },
          {
            "title": "PWM Theory & Applications",
            "duration": 45,
            "type": "theory",
            "description": "Pulse Width Modulation principles, duty cycle, and frequency"
          },
          {
            "title": "PWM Intensity Control Practical",
            "duration": 30,
            "type": "practical",
            "description": "Controlling LED intensity using PWM signals"
          },
          {
            "title": "PWM Oscilloscope Analysis",
            "duration": 30,
            "type": "practical",
            "description": "Observing PWM waveforms and analyzing signal characteristics"
          },
          {
            "title": "DC Motor Speed Control with PWM",
            "duration": 45,
            "type": "practical",
            "description": "Speed control of DC motors using PWM technique"
          },
          {
            "title": "DTMF System Practical",
            "duration": 45,
            "type": "project",
            "description": "Dual Tone Multi Frequency system for remote control applications"
          }
        ]
      },
      {
        "dayNumber": 3,
        "dayTitle": "Decision Making & Sensor Integration",
        "totalDuration": 480,
        "items": [
          {
            "title": "Decision Making in Programming",
            "duration": 45,
            "type": "theory",
            "description": "Conditional logic, program flow control, and decision structures"
          },
          {
            "title": "If-Condition Fundamentals",
            "duration": 60,
            "type": "theory",
            "description": "If statement syntax, logical expressions, and conditional execution"
          },
          {
            "title": "If-Condition Examples Part 1",
            "duration": 45,
            "type": "practical",
            "description": "Practical programming examples using simple if conditions"
          },
          {
            "title": "Nested If Conditions",
            "duration": 45,
            "type": "theory",
            "description": "Complex decision making with nested if statements and logic"
          },
          {
            "title": "If-Condition Examples Part 2",
            "duration": 45,
            "type": "practical",
            "description": "Advanced examples with multiple conditions and nested logic"
          },
          {
            "title": "Push Button Interfacing Theory",
            "duration": 30,
            "type": "theory",
            "description": "Push button working, debouncing, and input reading techniques"
          },
          {
            "title": "Pull-Down Configuration Practical",
            "duration": 30,
            "type": "practical",
            "description": "Implementing pull-down resistors for stable button inputs"
          },
          {
            "title": "Pull-Up Configuration Practical",
            "duration": 30,
            "type": "practical",
            "description": "Using external pull-up resistors for input stabilization"
          },
          {
            "title": "Internal Pull-Up Resistors",
            "duration": 30,
            "type": "practical",
            "description": "Activating and using microcontroller internal pull-up resistors"
          },
          {
            "title": "Industrial Sensors Comprehensive Guide",
            "duration": 90,
            "type": "theory",
            "description": "Complete overview of industrial sensors and their applications"
          },
          {
            "title": "Proximity Sensors (Inductive/Capacitive)",
            "duration": 30,
            "type": "demo",
            "description": "Working with inductive and capacitive proximity sensors"
          },
          {
            "title": "Photoelectric & Fiber Optic Sensors",
            "duration": 30,
            "type": "demo",
            "description": "Through-beam, reflective photoelectric sensors and fiber optics"
          },
          {
            "title": "Level & Reed Sensors",
            "duration": 30,
            "type": "demo",
            "description": "Water level sensors, reed switches, and magnetic sensing"
          },
          {
            "title": "DC Servo Motor Control Practical",
            "duration": 60,
            "type": "practical",
            "description": "Position control of DC servo motors with PWM signals"
          }
        ]
      },
      {
        "dayNumber": 4,
        "dayTitle": "Advanced Logic & Serial Communication",
        "totalDuration": 480,
        "items": [
          {
            "title": "Floating Point vs Integer Division",
            "duration": 45,
            "type": "theory",
            "description": "Numerical precision, data type selection, and calculation accuracy"
          },
          {
            "title": "Modulo Operation Applications",
            "duration": 30,
            "type": "theory",
            "description": "Modulo operator uses in programming and real-world applications"
          },
          {
            "title": "Advanced If-Condition Examples",
            "duration": 45,
            "type": "practical",
            "description": "Complex conditional logic with multiple variables"
          },
          {
            "title": "Logical Operators (AND/OR/NOT)",
            "duration": 45,
            "type": "theory",
            "description": "Boolean logic, truth tables, and compound conditions"
          },
          {
            "title": "Logical Operator Examples",
            "duration": 45,
            "type": "practical",
            "description": "Practical applications of logical operators in decision making"
          },
          {
            "title": "Digital Communication Fundamentals",
            "duration": 45,
            "type": "theory",
            "description": "Data transmission, protocols, and communication standards"
          },
          {
            "title": "Serial vs Parallel Communication",
            "duration": 45,
            "type": "theory",
            "description": "Comparison of serial and parallel communication methods"
          },
          {
            "title": "Serial Communication Protocols",
            "duration": 45,
            "type": "theory",
            "description": "UART, SPI, I2C protocols and their characteristics"
          },
          {
            "title": "RS-232 Protocol Theory",
            "duration": 30,
            "type": "theory",
            "description": "RS-232 standard, signal levels, and handshaking"
          },
          {
            "title": "Arduino to PC Data Transmission",
            "duration": 45,
            "type": "practical",
            "description": "Sending data from Arduino to PC via serial communication"
          },
          {
            "title": "PC to Arduino Data Reception",
            "duration": 45,
            "type": "practical",
            "description": "Receiving and processing data from PC to Arduino"
          },
          {
            "title": "Device Control via Serial Commands",
            "duration": 45,
            "type": "practical",
            "description": "Controlling multiple devices using serial command parsing"
          },
          {
            "title": "Bluetooth Communication Theory",
            "duration": 30,
            "type": "theory",
            "description": "Bluetooth protocol stack, pairing, and data exchange"
          },
          {
            "title": "Bluetooth Device Control",
            "duration": 45,
            "type": "practical",
            "description": "Wireless device control using Bluetooth modules"
          },
          {
            "title": "Elevator Control Project",
            "duration": 60,
            "type": "project",
            "description": "Complete elevator simulation with decision making logic"
          }
        ]
      },
      {
        "dayNumber": 5,
        "dayTitle": "Analog Systems & Display Interfaces",
        "totalDuration": 480,
        "items": [
          {
            "title": "Advanced If-Else Conditions",
            "duration": 60,
            "type": "theory",
            "description": "Complex conditional structures and multiple branching"
          },
          {
            "title": "If-Else Advantages & Best Practices",
            "duration": 45,
            "type": "theory",
            "description": "Code optimization, readability, and efficient conditional design"
          },
          {
            "title": "If-Else Practical Examples",
            "duration": 60,
            "type": "practical",
            "description": "Real-world programming scenarios using if-else structures"
          },
          {
            "title": "Analog to Digital Conversion Theory",
            "duration": 60,
            "type": "theory",
            "description": "ADC principles, resolution, sampling, and quantization"
          },
          {
            "title": "Potentiometer Interface Practical",
            "duration": 45,
            "type": "practical",
            "description": "Reading analog values from potentiometers with Arduino ADC"
          },
          {
            "title": "LED Intensity Control with POT",
            "duration": 45,
            "type": "practical",
            "description": "Controlling LED brightness using potentiometer input"
          },
          {
            "title": "Brushless Motor Speed Control",
            "duration": 60,
            "type": "practical",
            "description": "Speed control of brushless DC motors using analog inputs"
          },
          {
            "title": "LCD Display Interface Theory",
            "duration": 45,
            "type": "theory",
            "description": "LCD working, HD44780 controller, and communication protocol"
          },
          {
            "title": "LCD Programming Practical",
            "duration": 60,
            "type": "practical",
            "description": "Interfacing and programming character LCD displays"
          },
          {
            "title": "Flower Plant Monitoring Project",
            "duration": 60,
            "type": "project",
            "description": "Complete plant monitoring system with sensors and display"
          }
        ]
      },
      {
        "dayNumber": 6,
        "dayTitle": "Flowchart Design & System Integration",
        "totalDuration": 480,
        "items": [
          {
            "title": "Advanced If-Else Programming",
            "duration": 60,
            "type": "practical",
            "description": "Complex conditional logic with multiple variables and outcomes"
          },
          {
            "title": "Flowchart-Based System Design",
            "duration": 90,
            "type": "theory",
            "description": "Visual programming approach, flowchart symbols, and logic design"
          },
          {
            "title": "Flowchart Example Problems",
            "duration": 60,
            "type": "practical",
            "description": "Solving programming problems using flowchart methodology"
          },
          {
            "title": "Conveyor Belt System Project",
            "duration": 120,
            "type": "project",
            "description": "Designing and implementing automated conveyor system"
          },
          {
            "title": "Professional Wiring Techniques",
            "duration": 60,
            "type": "practical",
            "description": "Industrial wiring standards, cable management, and safety"
          },
          {
            "title": "Flowchart Implementation Workshop",
            "duration": 60,
            "type": "workshop",
            "description": "Converting flowcharts to actual C code implementation"
          },
          {
            "title": "Push Button Positive Edge Detection",
            "duration": 30,
            "type": "practical",
            "description": "Detecting and handling push button rising edge transitions"
          }
        ]
      },
      {
        "dayNumber": 7,
        "dayTitle": "Complex Decision Systems & Industrial Projects",
        "totalDuration": 480,
        "items": [
          {
            "title": "If-Else-If Ladder Structures",
            "duration": 90,
            "type": "theory",
            "description": "Multiple condition handling with else-if ladder approach"
          },
          {
            "title": "If-Else-If Practical Training",
            "duration": 90,
            "type": "practical",
            "description": "Hands-on programming with complex conditional hierarchies"
          },
          {
            "title": "Product Sorting System Project",
            "duration": 120,
            "type": "project",
            "description": "Automated product sorting based on size/color/weight parameters"
          },
          {
            "title": "Water Treatment Plant Simulation",
            "duration": 120,
            "type": "project",
            "description": "Complete water treatment and bottle filling automation system"
          },
          {
            "title": "Project Debugging & Optimization",
            "duration": 60,
            "type": "workshop",
            "description": "Debugging techniques and code optimization strategies"
          }
        ]
      },
      {
        "dayNumber": 8,
        "dayTitle": "Loop Structures & Advanced Motor Control",
        "totalDuration": 480,
        "items": [
          {
            "title": "Advanced If-Else-If Examples",
            "duration": 60,
            "type": "practical",
            "description": "Complex decision-making scenarios with multiple conditions"
          },
          {
            "title": "While Loop Fundamentals",
            "duration": 60,
            "type": "theory",
            "description": "Loop structures, iteration, and repetitive task automation"
          },
          {
            "title": "While Loop Practical Examples",
            "duration": 60,
            "type": "practical",
            "description": "Implementing various applications using while loops"
          },
          {
            "title": "Light System Design with Loops",
            "duration": 45,
            "type": "practical",
            "description": "Creating dynamic light patterns using loop structures"
          },
          {
            "title": "Intensity Control with Loops",
            "duration": 45,
            "type": "practical",
            "description": "Smooth intensity transitions using iterative control"
          },
          {
            "title": "Stepper Motor Control Theory",
            "duration": 60,
            "type": "theory",
            "description": "Stepper motor working, step modes, and driver circuits"
          },
          {
            "title": "Stepper Position Control Practical",
            "duration": 60,
            "type": "practical",
            "description": "Precise position control of stepper motors with Arduino"
          },
          {
            "title": "AC Servo Motor Theory",
            "duration": 45,
            "type": "theory",
            "description": "AC servo principles, feedback systems, and industrial applications"
          },
          {
            "title": "AC Servo Position Control",
            "duration": 60,
            "type": "practical",
            "description": "Programming AC servo motors for precise angular positioning"
          }
        ]
      },
      {
        "dayNumber": 9,
        "dayTitle": "Data Structures & Advanced Lighting Systems",
        "totalDuration": 480,
        "items": [
          {
            "title": "Advanced While Loop Applications",
            "duration": 60,
            "type": "practical",
            "description": "Complex looping scenarios and infinite loop prevention"
          },
          {
            "title": "Nested While Loops",
            "duration": 60,
            "type": "theory",
            "description": "Multi-dimensional iteration and nested loop patterns"
          },
          {
            "title": "Arrays in C Programming",
            "duration": 90,
            "type": "theory",
            "description": "Array declaration, initialization, access, and manipulation"
          },
          {
            "title": "1D Array Practical Examples",
            "duration": 60,
            "type": "practical",
            "description": "Working with single-dimensional arrays in various applications"
          },
          {
            "title": "RGB LED Theory & Control",
            "duration": 45,
            "type": "theory",
            "description": "RGB color mixing, PWM control, and color generation"
          },
          {
            "title": "NeoPixel LED Systems",
            "duration": 45,
            "type": "theory",
            "description": "Addressable RGB LEDs, protocols, and advanced lighting"
          },
          {
            "title": "NeoPixel Programming Practical",
            "duration": 60,
            "type": "practical",
            "description": "Creating dynamic lighting effects with addressable LEDs"
          },
          {
            "title": "Modular Production System (MPS)",
            "duration": 120,
            "type": "project",
            "description": "Complete industrial production line simulation"
          }
        ]
      },
      {
        "dayNumber": 10,
        "dayTitle": "Arrays & Communication Systems",
        "totalDuration": 480,
        "items": [
          {
            "title": "Advanced Array Manipulation",
            "duration": 90,
            "type": "practical",
            "description": "Array sorting, searching, and complex data handling"
          },
          {
            "title": "Array-Based Home Automation",
            "duration": 120,
            "type": "project",
            "description": "Complete home automation system using array data structures"
          },
          {
            "title": "Advanced Serial Communication",
            "duration": 60,
            "type": "theory",
            "description": "Serial protocol deep dive, baud rates, and data framing"
          },
          {
            "title": "ASCII Code System",
            "duration": 45,
            "type": "theory",
            "description": "Character encoding, ASCII table, and data representation"
          },
          {
            "title": "DTMF Based Control System",
            "duration": 90,
            "type": "project",
            "description": "Converting serial system to DTMF based remote control"
          },
          {
            "title": "Elevator Project - Flowchart Implementation",
            "duration": 120,
            "type": "project",
            "description": "Multi-floor elevator system with advanced control logic"
          }
        ]
      },
      {
        "dayNumber": 11,
        "dayTitle": "Functions, Interrupts & Autonomous Robots",
        "totalDuration": 480,
        "items": [
          {
            "title": "Advanced Array Applications",
            "duration": 60,
            "type": "practical",
            "description": "Multi-dimensional data handling and complex array operations"
          },
          {
            "title": "Functions in C Programming",
            "duration": 90,
            "type": "theory",
            "description": "Function declaration, definition, parameters, and return types"
          },
          {
            "title": "Function Types (1/2/3/4)",
            "duration": 60,
            "type": "theory",
            "description": "Different function categories based on parameters and returns"
          },
          {
            "title": "Variable Scope (Local/Global)",
            "duration": 45,
            "type": "theory",
            "description": "Variable visibility, lifetime, and scope management"
          },
          {
            "title": "External Interrupts Theory",
            "duration": 60,
            "type": "theory",
            "description": "Interrupt concepts, ISR, priority, and real-time response"
          },
          {
            "title": "Interrupt Service Routine Practical",
            "duration": 45,
            "type": "practical",
            "description": "Implementing and testing external interrupt handlers"
          },
          {
            "title": "Ultrasonic Sensor Theory",
            "duration": 45,
            "type": "theory",
            "description": "Ultrasonic ranging, time-of-flight, and distance calculation"
          },
          {
            "title": "Object Detection Practical",
            "duration": 45,
            "type": "practical",
            "description": "Distance measurement and object detection using ultrasonics"
          },
          {
            "title": "Object Detection Robot",
            "duration": 60,
            "type": "project",
            "description": "Robot that detects and responds to objects in path"
          },
          {
            "title": "Obstacle Avoiding Robot",
            "duration": 90,
            "type": "project",
            "description": "Complete autonomous robot with obstacle avoidance"
          }
        ]
      },
      {
        "dayNumber": 12,
        "dayTitle": "Control Systems & Line Following Robots",
        "totalDuration": 480,
        "items": [
          {
            "title": "Encoder Systems Theory",
            "duration": 60,
            "type": "theory",
            "description": "Rotary encoders, quadrature encoding, and position feedback"
          },
          {
            "title": "Control Systems Fundamentals",
            "duration": 90,
            "type": "theory",
            "description": "Open-loop vs closed-loop control, feedback, and system response"
          },
          {
            "title": "PID Controller Theory",
            "duration": 120,
            "type": "theory",
            "description": "Proportional, Integral, Derivative control and tuning methods"
          },
          {
            "title": "P-Controller Implementation",
            "duration": 30,
            "type": "theory",
            "description": "Proportional control characteristics and applications"
          },
          {
            "title": "PI-Controller Implementation",
            "duration": 30,
            "type": "theory",
            "description": "Proportional-Integral control for steady-state accuracy"
          },
          {
            "title": "PD-Controller Implementation",
            "duration": 30,
            "type": "theory",
            "description": "Proportional-Derivative control for improved response"
          },
          {
            "title": "PID-Controller Implementation",
            "duration": 30,
            "type": "theory",
            "description": "Complete PID control for optimal system performance"
          },
          {
            "title": "TCRT5000 Sensor Theory",
            "duration": 45,
            "type": "theory",
            "description": "Reflective optical sensor working and line detection principles"
          },
          {
            "title": "Transistor Switching Theory",
            "duration": 30,
            "type": "theory",
            "description": "Transistor as switch, saturation, cutoff regions"
          },
          {
            "title": "Phototransistor Characteristics",
            "duration": 30,
            "type": "theory",
            "description": "Light-sensitive transistors and their applications"
          },
          {
            "title": "TCRT5000 Interface Practical",
            "duration": 45,
            "type": "practical",
            "description": "Wiring and calibrating TCRT5000 for line detection"
          },
          {
            "title": "Line Following Robot - Basic Logic",
            "duration": 60,
            "type": "project",
            "description": "Simple line following using if-else conditional logic"
          },
          {
            "title": "Line Following Robot - Proportional Control",
            "duration": 60,
            "type": "project",
            "description": "Implementing P-control for smoother line following"
          },
          {
            "title": "Line Following Robot - PID Control",
            "duration": 90,
            "type": "project",
            "description": "Advanced line following with complete PID implementation"
          }
        ]
      },
      {
        "dayNumber": 13,
        "dayTitle": "Advanced Programming & PCB Design",
        "totalDuration": 480,
        "items": [
          {
            "title": "2D Arrays Theory",
            "duration": 60,
            "type": "theory",
            "description": "Multi-dimensional arrays, matrix operations, and applications"
          },
          {
            "title": "2D Array Practical Examples",
            "duration": 60,
            "type": "practical",
            "description": "Working with matrices and grid-based data structures"
          },
          {
            "title": "For Loop Structures",
            "duration": 60,
            "type": "theory",
            "description": "For loop syntax, initialization, condition, and increment"
          },
          {
            "title": "2D Arrays with For Loops",
            "duration": 90,
            "type": "practical",
            "description": "Nested loops for 2D array manipulation and processing"
          },
          {
            "title": "PCB Design Introduction",
            "duration": 90,
            "type": "theory",
            "description": "Printed Circuit Board fundamentals and design process"
          },
          {
            "title": "SMD vs Through-Hole Components",
            "duration": 45,
            "type": "theory",
            "description": "Component packaging, advantages, and selection criteria"
          },
          {
            "title": "Schematic Design Principles",
            "duration": 60,
            "type": "practical",
            "description": "Creating circuit schematics and symbol libraries"
          },
          {
            "title": "Board Layout Design",
            "duration": 60,
            "type": "practical",
            "description": "PCB layout, component placement, and routing techniques"
          },
          {
            "title": "Footprint Management",
            "duration": 45,
            "type": "practical",
            "description": "Component footprints, library creation, and management"
          },
          {
            "title": "Net Classes & Design Rules",
            "duration": 45,
            "type": "theory",
            "description": "Design rule checking, net classes, and manufacturing preparation"
          }
        ]
      },
      {
        "dayNumber": 14,
        "dayTitle": "IoT Systems & Web Integration",
        "totalDuration": 480,
        "items": [
          {
            "title": "Web Design Fundamentals",
            "duration": 90,
            "type": "theory",
            "description": "HTML structure, CSS styling, and web development basics"
          },
          {
            "title": "ESP32 Web Client Theory",
            "duration": 60,
            "type": "theory",
            "description": "ESP32 WiFi capabilities, web client/server functionality"
          },
          {
            "title": "Web Template Design Practical",
            "duration": 90,
            "type": "practical",
            "description": "Creating responsive web interfaces for IoT applications"
          },
          {
            "title": "Website Deployment Process",
            "duration": 60,
            "type": "theory",
            "description": "Domain registration, web servers, and DNS configuration"
          },
          {
            "title": "ASP.NET Introduction",
            "duration": 60,
            "type": "theory",
            "description": "Web application framework for dynamic content generation"
          },
          {
            "title": "Home Automation System Design",
            "duration": 90,
            "type": "project",
            "description": "Designing complete web-controlled home automation"
          },
          {
            "title": "HTTP Request Handling",
            "duration": 60,
            "type": "practical",
            "description": "Processing HTTP requests and responses in embedded systems"
          },
          {
            "title": "Web-Based Home Automation",
            "duration": 120,
            "type": "project",
            "description": "Complete IoT home automation with web interface"
          }
        ]
      },
      {
        "dayNumber": 15,
        "dayTitle": "Advanced Protocols & Final Integration",
        "totalDuration": 480,
        "items": [
          {
            "title": "C Programming Comprehensive Revision",
            "duration": 90,
            "type": "theory",
            "description": "Complete C language review and best practices"
          },
          {
            "title": "I2C Protocol Theory",
            "duration": 90,
            "type": "theory",
            "description": "I2C bus architecture, addressing, and communication protocol"
          },
          {
            "title": "Master-Slave Communication",
            "duration": 45,
            "type": "theory",
            "description": "I2C multi-device communication and bus arbitration"
          },
          {
            "title": "Common I2C Devices",
            "duration": 45,
            "type": "demo",
            "description": "Overview of I2C sensors, RTC, EEPROM, and other peripherals"
          },
          {
            "title": "DS1307 RTC Module",
            "duration": 60,
            "type": "theory",
            "description": "Real-time clock operation, registers, and timekeeping"
          },
          {
            "title": "I2C Communication with RTC",
            "duration": 60,
            "type": "practical",
            "description": "Implementing I2C protocol for RTC communication"
          },
          {
            "title": "RTC Library Programming",
            "duration": 60,
            "type": "practical",
            "description": "Using and customizing RTC libraries for time applications"
          },
          {
            "title": "Modbus RTU 485 Protocol Theory",
            "duration": 90,
            "type": "theory",
            "description": "Industrial Modbus protocol, RS-485 physical layer, addressing"
          },
          {
            "title": "Modbus RTU Practical Implementation",
            "duration": 90,
            "type": "practical",
            "description": "Configuring Modbus communication between devices"
          },
          {
            "title": "VFD Control via Modbus RTU",
            "duration": 120,
            "type": "project",
            "description": "Controlling Variable Frequency Drives using Modbus protocol"
          },
          {
            "title": "Arduino Modbus Integration",
            "duration": 90,
            "type": "practical",
            "description": "Implementing Modbus RTU master/slave on Arduino platforms"
          },
          {
            "title": "Proteus Simulation Workshop",
            "duration": 60,
            "type": "workshop",
            "description": "Circuit simulation and virtual prototyping techniques"
          },
          {
            "title": "Railway Simulation System",
            "duration": 120,
            "type": "project",
            "description": "Complete railway control system simulation with multiple protocols"
          },
          {
            "title": "Course Project Integration",
            "duration": 120,
            "type": "project",
            "description": "Final comprehensive project integrating all course concepts"
          }
        ]
      }
    ];

    // Save the updated course
    await course.save();
    console.log(`✅ Syllabus updated successfully for ${course.title}`);
    console.log(`📚 Total days: ${course.syllabus.length}`);
    
    // Calculate total duration
    const totalMinutes = course.syllabus.reduce((total, day) => {
      return total + day.items.reduce((dayTotal, item) => dayTotal + item.duration, 0);
    }, 0);
    
    const totalHours = Math.round(totalMinutes / 60);
    console.log(`⏱️ Total course duration: ${totalHours} hours`);

  } catch (error) {
    console.error('❌ Error updating syllabus:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📚 Database connection closed');
  }
};

// Run the script
connectDB().then(() => updateBasicPLCSyllabus());