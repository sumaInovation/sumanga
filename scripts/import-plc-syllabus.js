
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
    const courseCode = "PLC101"; // Basic PLC Programming course
    
    const course = await Course.findOne({ code: courseCode });
    if (!course) {
      console.log(`❌ Course with code ${courseCode} not found`);
      return;
    }

    // Update the course with exact 19-day syllabus from your provided structure
    course.syllabus = [
      {
        dayNumber: 1,
        dayTitle: "Digital Fundamentals & Electromechanical Control",
        items: [
          { title: "Understanding Digital vs. Analog Concepts", duration: 60, type: "theory" },
          { title: "Basics of the Binary Number System", duration: 75, type: "theory" },
          { title: "Performing Arithmetic in Binary", duration: 75, type: "theory" },
          { title: "Overview of Fundamental Logic Gates", duration: 90, type: "theory" },
          { title: "Analyzing Logic Circuits using Truth Tables", duration: 60, type: "practical" },
          { title: "Interpreting Logic Circuits using Boolean Expressions", duration: 75, type: "theory" },
          { title: "Designing Logic Circuits Based on Given Functions", duration: 90, type: "practical" },
          { title: "Introduction to Minterms and Logic Simplification", duration: 60, type: "theory" },
          { title: "Creating Logic Circuits from Truth Tables", duration: 75, type: "practical" },
          { title: "Steps to Design a Complete Control Circuit", duration: 60, type: "theory" },
          { title: "Introduction to Industrial Contactors", duration: 60, type: "theory" },
          { title: "Practical 01: Wiring a Magnetic Contactor with Safety Precautions", duration: 120, type: "practical" },
          { title: "Practical 02: Control a Load Using Contactor NO/NC Terminals", duration: 90, type: "practical" },
          { title: "Basic Contactor Application Examples", duration: 60, type: "theory" },
          { title: "Techniques for Designing Contactor-Based Control Systems", duration: 75, type: "theory" },
          { title: "Practical 03: Build a Basic Conveyor Control Circuit Using Contactors", duration: 120, type: "practical" }
        ]
      },
      {
        dayNumber: 2,
        dayTitle: "PLC Basics & FBD Programming",
        items: [
          { title: "What is a Program? (Logic vs. Electronic Control)", duration: 45, type: "theory" },
          { title: "Introduction to PLCs and Their Role in Automation", duration: 60, type: "theory" },
          { title: "PLC Programming Languages & Execution Cycle", duration: 75, type: "theory" },
          { title: "Overview of Siemens S7-200 Series", duration: 60, type: "theory" },
          { title: "Understanding PLC Input / Output Addressing", duration: 75, type: "theory" },
          { title: "Introduction to Functional Block Diagrams (FBD)", duration: 75, type: "theory" },
          { title: "FBD Gate-based Examples - AND / OR Blocks", duration: 60, type: "practical" },
          { title: "Multi-input Logic", duration: 60, type: "practical" },
          { title: "Buffer & NOT Functions", duration: 60, type: "practical" },
          { title: "Multi-network Programming", duration: 60, type: "theory" },
          { title: "Introduction to the PLC Memory Bit Area", duration: 45, type: "theory" },
          { title: "Designing Complex Logic Circuits in FBD", duration: 90, type: "practical" },
          { title: "PLC Wiring Hands-on - S7-200", duration: 45, type: "practical" },
          { title: "PLC Wiring Hands-on - S7-300", duration: 45, type: "practical" },
          { title: "PLC Wiring Hands-on - S7-400", duration: 45, type: "practical" },
          { title: "PLC Wiring Hands-on - S7-1200", duration: 45, type: "practical" },
          { title: "PLC Wiring Hands-on - Siemens LOGO", duration: 45, type: "practical" },
          { title: "Digital Input Wiring - Interfacing Pushbuttons", duration: 60, type: "practical" },
          { title: "Interfacing Digital Sensors - Inductive Sensors", duration: 45, type: "practical" },
          { title: "Interfacing Digital Sensors - Capacitive Sensors", duration: 45, type: "practical" },
          { title: "Interfacing Digital Sensors - Photoelectric Sensors", duration: 45, type: "practical" },
          { title: "Interfacing Digital Sensors - Reflective Sensors", duration: 45, type: "practical" },
          { title: "Interfacing Digital Sensors - Level Detection Sensors", duration: 45, type: "practical" },
          { title: "Interfacing Digital Sensors - Fiber Optic Sensors", duration: 45, type: "practical" }
        ]
      },
      {
        dayNumber: 3,
        dayTitle: "Ladder Logic & Basic Control",
        items: [
          { title: "Revision of FBD Programming", duration: 60, type: "theory" },
          { title: "Introduction to Ladder Diagram Programming", duration: 75, type: "theory" },
          { title: "Ladder Logic Simulation Examples", duration: 90, type: "practical" },
          { title: "Basic Ladder Techniques (AND / OR / NOT)", duration: 75, type: "practical" },
          { title: "Understanding the PLC Scan Cycle", duration: 45, type: "theory" },
          { title: "Bit Logic – Part 01 - Normally Open Contact", duration: 45, type: "theory" },
          { title: "Bit Logic – Part 01 - Normally Closed Contact", duration: 45, type: "theory" },
          { title: "Bit Logic – Part 01 - Output Coil", duration: 45, type: "theory" },
          { title: "Bit Logic – Part 01 - NOT Function", duration: 45, type: "theory" },
          { title: "Latching / Self-Holding Circuits", duration: 60, type: "theory" },
          { title: "Bit Logic – Part 02 - SET Coil", duration: 45, type: "theory" },
          { title: "Bit Logic – Part 02 - RESET Coil", duration: 45, type: "theory" },
          { title: "Bit Logic – Part 02 - Positive Edge Contact", duration: 45, type: "theory" },
          { title: "Bit Logic – Part 02 - Negative Edge Contact", duration: 45, type: "theory" },
          { title: "Bit Logic – Part 02 - Immediate Input Instructions", duration: 45, type: "theory" },
          { title: "Bit Logic – Part 02 - Immediate Output Instructions", duration: 45, type: "theory" },
          { title: "Introduction to Relays", duration: 60, type: "theory" },
          { title: "Practical 01: Relay Wiring & Testing", duration: 90, type: "practical" },
          { title: "Practical 02: Develop a Relay-based Motor Switching Circuit", duration: 120, type: "practical" },
          { title: "Understanding PLC Output Wiring", duration: 60, type: "theory" },
          { title: "Introduction to 7-Segment Displays", duration: 45, type: "theory" },
          { title: "BCD to 7-Segment Driver IC", duration: 60, type: "theory" },
          { title: "Practical 03: Interfacing a 7-Segment with PLC", duration: 90, type: "practical" },
          { title: "Practical 04: Create a Numeric Display Using Weighted Logic", duration: 120, type: "practical" }
        ]
      },
      {
        dayNumber: 4,
        dayTitle: "Counters & Pneumatics",
        items: [
          { title: "Reading and Creating Timing Diagrams", duration: 75, type: "theory" },
          { title: "Basics of PLC Program Development", duration: 60, type: "theory" },
          { title: "Practical Programming Examples", duration: 90, type: "practical" },
          { title: "Introduction to PLC Counters", duration: 60, type: "theory" },
          { title: "Understanding Up Counters", duration: 75, type: "theory" },
          { title: "Counter-based Exercises", duration: 90, type: "practical" },
          { title: "Self-resetting Counters", duration: 60, type: "theory" },
          { title: "Examples of Auto-reset Counters", duration: 75, type: "practical" },
          { title: "Introduction to Up/Down Counters", duration: 60, type: "theory" },
          { title: "Project 01: Customer Queue / Waiting Room Counter", duration: 120, type: "project" },
          { title: "Basics of Industrial Pneumatics", duration: 90, type: "theory" },
          { title: "Project 02: Manual Pick-and-Place Pneumatic Arm Using Counters", duration: 150, type: "project" }
        ]
      },
      {
        dayNumber: 5,
        dayTitle: "Timers & Conveyor Projects",
        items: [
          { title: "Timer-based Timing Diagram Exercises", duration: 90, type: "theory" },
          { title: "Understanding PLC Timers", duration: 75, type: "theory" },
          { title: "ON Delay Timer", duration: 60, type: "theory" },
          { title: "Timer Example Problems", duration: 90, type: "practical" },
          { title: "Self-reset Timers", duration: 60, type: "theory" },
          { title: "Self-reset Timer Exercises", duration: 75, type: "practical" },
          { title: "Practical 01: Build a Light-blinking Sequence with Timers", duration: 120, type: "practical" },
          { title: "Practical 02: Wiring a Basic Conveyor Control Panel", duration: 120, type: "practical" },
          { title: "Project: Develop a Complete Automated Conveyor System", duration: 180, type: "project" }
        ]
      },
      {
        dayNumber: 6,
        dayTitle: "Flowchart-based Design",
        items: [
          { title: "Advanced Timing Diagram Examples", duration: 75, type: "theory" },
          { title: "Introduction to Flowchart-based Control Design", duration: 90, type: "theory" },
          { title: "Example Flowchart Problems", duration: 90, type: "practical" },
          { title: "Project: Basic Water Purification & Filling System", duration: 150, type: "project" },
          { title: "Techniques for Designing with Flowcharts", duration: 90, type: "theory" },
          { title: "Completing the Water Filling Automation Project", duration: 120, type: "project" }
        ]
      },
      {
        dayNumber: 7,
        dayTitle: "Decision Making in PLC",
        items: [
          { title: "Understanding Decision-Making Concepts", duration: 60, type: "theory" },
          { title: "Introduction to IF Conditions", duration: 75, type: "theory" },
          { title: "IF-based Practice Problems", duration: 90, type: "practical" },
          { title: "Nested IF Structures", duration: 75, type: "theory" },
          { title: "Nested IF Examples", duration: 90, type: "practical" },
          { title: "AND/OR Condition Operations", duration: 60, type: "theory" },
          { title: "AND/OR Logic Exercises", duration: 90, type: "practical" },
          { title: "Ladder Compare Instructions", duration: 75, type: "theory" },
          { title: "Practical 01: Queue Management System using Compare Instructions", duration: 120, type: "practical" },
          { title: "Practical 02: Light Control Design using Comparison Logic", duration: 120, type: "practical" },
          { title: "Project: Flowchart-based Product Sorting System", duration: 180, type: "project" }
        ]
      },
      {
        dayNumber: 8,
        dayTitle: "IF-ELSE Programming & Projects",
        items: [
          { title: "Introduction to IF–ELSE Logic", duration: 75, type: "theory" },
          { title: "IF–ELSE Example Problems", duration: 90, type: "practical" },
          { title: "Converting IF–ELSE Logic to Ladder", duration: 75, type: "theory" },
          { title: "Ladder Conversion Techniques", duration: 90, type: "practical" },
          { title: "Project 01: Multi-level Elevator Control System", duration: 240, type: "project" },
          { title: "Project 02: Advanced Traffic Signal Automation", duration: 240, type: "project" }
        ]
      },
      {
        dayNumber: 9,
        dayTitle: "PLC Memory & Move Operations",
        items: [
          { title: "Overview of PLC RAM", duration: 60, type: "theory" },
          { title: "Understanding the PLC Memory Map", duration: 75, type: "theory" },
          { title: "Accessing Bits, Bytes, Words, Double Words - Input Image", duration: 45, type: "theory" },
          { title: "Accessing Bits, Bytes, Words, Double Words - Output Image", duration: 45, type: "theory" },
          { title: "Accessing Bits, Bytes, Words, Double Words - Memory Bit Area", duration: 45, type: "theory" },
          { title: "Introduction to Variable Memory (V Area)", duration: 60, type: "theory" },
          { title: "Move Operations - Move Byte", duration: 45, type: "theory" },
          { title: "Move Operations - Move Word", duration: 45, type: "theory" },
          { title: "Move Operations - Move Double Word", duration: 45, type: "theory" },
          { title: "Move Operations - Move Real (Float)", duration: 45, type: "theory" },
          { title: "Move Instruction Examples", duration: 90, type: "practical" },
          { title: "Practical 01: Light Pattern Design Using MOVE Instructions", duration: 120, type: "practical" },
          { title: "Project: Modular Production System (MPS) Using Flowcharts", duration: 180, type: "project" }
        ]
      },
      {
        dayNumber: 10,
        dayTitle: "Integer Math & HMI",
        items: [
          { title: "Introduction to Block Move (BMOV)", duration: 60, type: "theory" },
          { title: "Integer Operations - Add", duration: 45, type: "theory" },
          { title: "Integer Operations - Subtract", duration: 45, type: "theory" },
          { title: "Integer Operations - Multiply", duration: 45, type: "theory" },
          { title: "Integer Operations - Divide", duration: 45, type: "theory" },
          { title: "Integer Operations - Increment", duration: 45, type: "theory" },
          { title: "Integer Operations - Decrement", duration: 45, type: "theory" },
          { title: "Integer Operation Exercises", duration: 90, type: "practical" },
          { title: "Practical 01: Lighting Logic using Arithmetic Instructions", duration: 120, type: "practical" },
          { title: "Introduction to HMI Interfaces", duration: 60, type: "theory" },
          { title: "Overview of OP320A Panels", duration: 75, type: "theory" },
          { title: "OP320A Hands-on Practicals", duration: 120, type: "practical" }
        ]
      },
      {
        dayNumber: 11,
        dayTitle: "Floating Point & Subroutines",
        items: [
          { title: "Basics of Floating-Point Operations", duration: 75, type: "theory" },
          { title: "Floating-Point Programming Examples", duration: 90, type: "practical" },
          { title: "Introduction to Subroutines", duration: 60, type: "theory" },
          { title: "Subroutine-based Exercises", duration: 90, type: "practical" },
          { title: "Elevator Control Project (Using MOVE Instructions)", duration: 180, type: "project" }
        ]
      },
      {
        dayNumber: 12,
        dayTitle: "Special Memory & Motor Control",
        items: [
          { title: "Special Memory Area (SM Area) Overview", duration: 75, type: "theory" },
          { title: "Understanding SMB0", duration: 60, type: "theory" },
          { title: "Introduction to PWM", duration: 75, type: "theory" },
          { title: "Practical 01: Speed Control of a DC Motor using PWM", duration: 120, type: "practical" },
          { title: "Practical 02: Observing PWM Waveforms", duration: 90, type: "practical" },
          { title: "Introduction to Pulse Train Output (PTO)", duration: 75, type: "theory" },
          { title: "Practical 03: Stepper Motor Direction & Step Control", duration: 120, type: "practical" },
          { title: "Introduction to AC Servo Motors", duration: 60, type: "theory" },
          { title: "Practical 04: AC Servo Position Control", duration: 120, type: "practical" },
          { title: "Software-based Servo Control Demo", duration: 60, type: "demo" },
          { title: "Demo: Linear Guide with AC Servo", duration: 90, type: "demo" }
        ]
      },
      {
        dayNumber: 13,
        dayTitle: "Interrupts, Encoders & Mitsubishi PLC",
        items: [
          { title: "Understanding Interrupt Concepts", duration: 75, type: "theory" },
          { title: "External Interrupts", duration: 60, type: "theory" },
          { title: "Detecting Pulses on Inputs", duration: 75, type: "theory" },
          { title: "Introduction to Rotary Encoders", duration: 60, type: "theory" },
          { title: "Writing an RPM Calculation Program", duration: 90, type: "practical" },
          { title: "Understanding High-Speed Counters (HSC)", duration: 75, type: "theory" },
          { title: "HSC Configuration and Modes", duration: 90, type: "theory" },
          { title: "HSC Simulations", duration: 60, type: "practical" },
          { title: "Practical 01: Observing Encoder Pulse Output", duration: 90, type: "practical" },
          { title: "Practical 02: Understanding A/B Phase Difference", duration: 90, type: "practical" },
          { title: "Practical 03: Normal Counter vs. HSC Demonstration", duration: 60, type: "practical" },
          { title: "Introduction to Mitsubishi FX Series PLC", duration: 75, type: "theory" },
          { title: "Simulation of Bit Logic / Timers / Counters", duration: 90, type: "practical" },
          { title: "Water Treatment Project on Mitsubishi PLC", duration: 150, type: "project" }
        ]
      },
      {
        dayNumber: 14,
        dayTitle: "Data Types, Strings & Serial Communication",
        items: [
          { title: "PLC Data Types Overview", duration: 75, type: "theory" },
          { title: "Understanding Character and String Data", duration: 60, type: "theory" },
          { title: "String Manipulation Examples", duration: 90, type: "practical" },
          { title: "Introduction to Digital Communication", duration: 60, type: "theory" },
          { title: "Serial vs. Parallel Communication", duration: 75, type: "theory" },
          { title: "Serial Protocol Fundamentals", duration: 60, type: "theory" },
          { title: "Introduction to RS-232", duration: 75, type: "theory" },
          { title: "PLC → PC Data Transmission", duration: 90, type: "practical" },
          { title: "PC → PLC Data Reception", duration: 90, type: "practical" },
          { title: "Device Control Using Serial Commands", duration: 120, type: "practical" },
          { title: "Basics of Automation Software Design", duration: 60, type: "theory" },
          { title: "Introduction to Visual Basic", duration: 75, type: "theory" },
          { title: "Working with Buttons, Text Fields, Checkboxes, etc.", duration: 90, type: "practical" },
          { title: "Designing a Simple VB Interface & EXE Generation", duration: 120, type: "practical" },
          { title: "Basic VB Coding - Variables", duration: 60, type: "theory" },
          { title: "Basic VB Coding - IF / IF-ELSE", duration: 75, type: "theory" },
          { title: "Basic VB Coding - AND / OR Logic", duration: 60, type: "theory" },
          { title: "Develop a VB Program to Find Maximum Value", duration: 90, type: "practical" },
          { title: "Build a VB Interface and Communicate with PLC (RS-232)", duration: 150, type: "project" }
        ]
      },
      {
        dayNumber: 15,
        dayTitle: "Siemens S7-300 / S7-400 Control Systems",
        items: [
          { title: "Overview of S7-300 / S7-400 PLCs", duration: 75, type: "theory" },
          { title: "Creating a Project & Hardware Setup", duration: 90, type: "practical" },
          { title: "Bit Logic Examples and Simulations", duration: 90, type: "practical" },
          { title: "Timers / Counters in Step7", duration: 75, type: "theory" },
          { title: "Compare Instruction Examples", duration: 90, type: "practical" },
          { title: "MOVE Instruction Examples", duration: 90, type: "practical" },
          { title: "Practical 01: S7-300 Wiring & Program Download", duration: 120, type: "practical" },
          { title: "Practical 02: S7-400 Wiring & Program Download", duration: 120, type: "practical" },
          { title: "Introduction to Remote IO Systems", duration: 75, type: "theory" },
          { title: "Practical 03: Wiring ET200S / ET200M Remote IO", duration: 120, type: "practical" },
          { title: "Project: Water Treatment Automation using Remote IO", duration: 180, type: "project" }
        ]
      },
      {
        dayNumber: 16,
        dayTitle: "WINCC & SCADA Development",
        items: [
          { title: "Introduction to SCADA Systems", duration: 75, type: "theory" },
          { title: "Siemens Touch Panel Overview", duration: 60, type: "theory" },
          { title: "Creating a WINCC Project", duration: 90, type: "practical" },
          { title: "Tag Creation & Linking with Step7", duration: 90, type: "practical" },
          { title: "Button / Toggle / Control Elements", duration: 75, type: "practical" },
          { title: "Real-time Simulation with PLC", duration: 90, type: "practical" },
          { title: "Working with Bargraphs, DateTime, Circular Objects, etc.", duration: 90, type: "practical" },
          { title: "Enhanced Visual Elements", duration: 60, type: "theory" },
          { title: "Project: Complete SCADA Design for Water Treatment System", duration: 240, type: "project" }
        ]
      },
      {
        dayNumber: 17,
        dayTitle: "Shift Registers & Analog Processing",
        items: [
          { title: "Introduction to Shift / Rotate Instructions", duration: 75, type: "theory" },
          { title: "Practical 01: Design a Light Pattern using Shift Commands", duration: 120, type: "practical" },
          { title: "Introduction to Analog to Digital Conversion", duration: 60, type: "theory" },
          { title: "S7-200 ADC Overview", duration: 75, type: "theory" },
          { title: "Practical 02: Water Tank Level Monitoring", duration: 120, type: "practical" },
          { title: "S7-300/400 ADC Overview", duration: 75, type: "theory" },
          { title: "Practical 03: Interfacing PT100 / Thermocouples", duration: 120, type: "practical" },
          { title: "Introduction to DAC (Digital to Analog)", duration: 60, type: "theory" },
          { title: "Practical 04: Speed Control of Induction Motor using Analog Output", duration: 150, type: "practical" }
        ]
      },
      {
        dayNumber: 18,
        dayTitle: "Control Systems & PID",
        items: [
          { title: "Why Modern Systems Need Control", duration: 45, type: "theory" },
          { title: "Advantages of Automation Control", duration: 45, type: "theory" },
          { title: "Types of Control Systems", duration: 60, type: "theory" },
          { title: "PID Controller Theory", duration: 75, type: "theory" },
          { title: "P Control", duration: 60, type: "theory" },
          { title: "PI Control", duration: 60, type: "theory" },
          { title: "PD Control", duration: 60, type: "theory" },
          { title: "Complete PID Control", duration: 75, type: "theory" }
        ]
      },
      {
        dayNumber: 19,
        dayTitle: "Web Design & IoT in Automation",
        items: [
          { title: "Introduction to Web Development for Automation", duration: 75, type: "theory" },
          { title: "Industry 4.0 Concepts", duration: 60, type: "theory" },
          { title: "IoT in Industrial Automation", duration: 75, type: "theory" },
          { title: "Fundamentals of HTML & CSS", duration: 90, type: "theory" },
          { title: "Create Simple Web Templates", duration: 120, type: "practical" },
          { title: "Hosting and Domain Concepts - Domain Registration", duration: 45, type: "theory" },
          { title: "Hosting and Domain Concepts - Server Selection", duration: 45, type: "theory" },
          { title: "Hosting and Domain Concepts - DNS Configuration", duration: 45, type: "theory" },
          { title: "Introduction to ASP.NET", duration: 75, type: "theory" },
          { title: "Designing a Home Automation Web Interface", duration: 120, type: "practical" },
          { title: "Accessing Devices via HTTP Requests", duration: 90, type: "practical" },
          { title: "Project: Complete IoT-based Home Automation System", duration: 240, type: "project" }
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