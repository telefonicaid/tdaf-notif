class dependpoint {
  # Installation dirs
  ################################
  $installdir = "/opt/tdaf"
  $deploydir = "${installdir}/deploy"

  file {'/opt/tdaf':
    ensure => directory,
    owner => "root",
    group => "root",
    mode => 744,
  }

  file {'/opt/tdaf/deploy':
    ensure => directory,
    owner => "root",
    group => "root",
    mode => 744,
    require => File['/opt/tdaf'],
  }

  file {'sourcecode':
    path => "$deploydir/localSourceCode.tar",
    ensure => present,
    owner => "root",
    group => "root",
    source => "puppet:///extra_files/localSourceCode.tar",
    mode => 744,
    require => File['/opt/tdaf/deploy'],
  }

  exec {'uncompress':
    command => '/bin/tar xvf localSourceCode.tar',
    unless => '/bin/ls /opt/tdaf/deploy/package.json',
    cwd => "$deploydir",
    require => File['sourcecode'],
  }

  file {'/etc/init.d/deploy-service':
    owner => "root",
    group => "root",
    mode => 744,
    source => "puppet:///modules/${module_name}/deploy-service",
    require => Exec['uncompress'],
  } 

  # Install Environment
  ################################
  exec {'epelrepo':
    command => '/bin/rpm -Uvh http://ftp.rediris.es/mirror/fedora-epel/6/i386/epel-release-6-7.noarch.rpm',
    unless => '/usr/bin/yum repolist | /bin/grep epel',
    path => '/root',
  }

  package { 'nodejs':
    ensure => installed,
    require => Exec['epelrepo'],
  }

  package { 'npm':
    ensure => installed,
    require => Exec['epelrepo'],
  }

  # Configure and execute the service
  ####################################
  file { "/etc/sysconfig/iptables":
    notify => Service['iptables'],
    owner => "root",
    group => "root",
    mode => 600,
    source => "puppet:///modules/${module_name}/iptables",
  }

  service { 'iptables':
    ensure => "running",
  }

  exec { 'dependencies':
    command => '/usr/bin/npm install --production',
    cwd => "$deploydir",
    user => "root",
    require => Package['npm', 'nodejs'],
  }

  file { "$deploydir/config.js":
    owner => "root",
    group => "root",
    mode => 644,
    content => template("${module_name}/config.js"),
    require => Exec['dependencies'],
  }

  service { 'deploy-service':
    ensure => "running",
    require => File["$deploydir/config.js"],
  }

}
